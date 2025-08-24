import type { Currency, Periodicity } from '@fintrak/types';
import type { Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import ExpenseModel from '../models/ExpenseModel';
import IncomeModel from '../models/IncomeModel';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  currency?: string;
  type?: 'expense' | 'income';
  category?: string;
  periodicity?: Periodicity;
  movement_type?: string;
  observations?: string;
}

export const importTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Try to detect BBVA format (check if "Últimos movimientos" is present)
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const isBBVAFormat = rawData.some(
      (row) =>
        Array.isArray(row) &&
        row.some(
          (cell) =>
            typeof cell === 'string' && cell.includes('Últimos movimientos')
        )
    );

    let data: ParsedTransaction[] = [];

    if (isBBVAFormat) {
      // Find the header row (contains "F.Valor", "Fecha", etc.)
      const headerRowIndex = rawData.findIndex(
        (row) =>
          Array.isArray(row) && row.includes('F.Valor') && row.includes('Fecha')
      );

      if (headerRowIndex === -1) {
        return res
          .status(400)
          .json({ error: 'BBVA format detected but header row not found' });
      }

      // Extract data starting from after header row
      const transactionRows = rawData
        .slice(headerRowIndex + 1)
        .filter(
          (row) =>
            Array.isArray(row) &&
            row.length >= 5 &&
            row[1] &&
            row[2] &&
            typeof row[4] === 'number'
        );

      // Convert BBVA format to our expected format
      data = (transactionRows as any[][]).map((row) => ({
        date: row[1] as string, // Fecha column
        description: row[2] as string, // Concepto column
        amount: row[4] as number, // Importe column
        currency: (row[5] as string) || 'EUR', // Divisa column
        movement_type: row[3] as string, // Movimiento column
        observations: row[8] as string, // Observaciones column
      }));
    } else {
      // Standard format
      data = XLSX.utils.sheet_to_json(worksheet);
    }

    const results = {
      total: data.length,
      imported: 0,
      errors: [] as string[],
      expenses: 0,
      income: 0,
      format: isBBVAFormat ? 'BBVA' : 'Standard',
    };

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];

        // Validate required fields
        if (!row.date || !row.description || row.amount === undefined) {
          results.errors.push(
            `Row ${i + 1}: Missing required fields (date, description, amount)`
          );
          continue;
        }

        // Parse date - handle DD/MM/YYYY format common in Spanish banks
        let transactionDate: Date;
        try {
          if (typeof row.date === 'string' && row.date.includes('/')) {
            const [day, month, year] = row.date.split('/');
            transactionDate = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );
          } else {
            transactionDate = new Date(row.date);
          }

          if (Number.isNaN(transactionDate.getTime())) {
            throw new Error('Invalid date');
          }
        } catch {
          results.errors.push(`Row ${i + 1}: Invalid date format`);
          continue;
        }

        // Determine transaction type based on amount or explicit type
        const isExpense =
          row.type === 'expense' || (!row.type && row.amount < 0);
        const absAmount = Math.abs(row.amount);

        // Clean up description
        const cleanDescription = row.description.trim();

        // Try to determine category from BBVA movement type or description
        let categoryName = 'Imported';
        let categoryIcon = '📄';

        if (isBBVAFormat && row.movement_type) {
          switch (row.movement_type.toLowerCase()) {
            case 'pago con tarjeta':
              categoryName = 'Card Payment';
              categoryIcon = '💳';
              break;
            case 'transferencia':
              categoryName = 'Transfer';
              categoryIcon = '💸';
              break;
            case 'ingreso':
              categoryName = 'Deposit';
              categoryIcon = '💰';
              break;
            default:
              categoryName = row.movement_type;
              categoryIcon = '💳';
          }
        }

        const transactionData: any = {
          title: cleanDescription,
          amount: absAmount,
          currency: (row.currency || 'EUR') as Currency,
          category: {
            id: categoryName.toLowerCase().replace(/\s+/g, '_'),
            name: categoryName,
            color: '#6B7280',
            icon: categoryIcon,
          },
          date: transactionDate,
          periodicity: row.periodicity || ('NOT_RECURRING' as Periodicity),
          description: isBBVAFormat
            ? `${row.movement_type} - ${cleanDescription}${row.observations ? ` (${row.observations})` : ''}`
            : `Imported from Excel - ${cleanDescription}`,
          userId,
        };

        // Only add payee/source if we have counterparty information
        // For now, we'll skip adding them to avoid validation errors

        if (isExpense) {
          await ExpenseModel.create(transactionData);
          results.expenses++;
        } else {
          await IncomeModel.create(transactionData);
          results.income++;
        }

        results.imported++;
      } catch (error) {
        results.errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      error: 'Failed to import transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

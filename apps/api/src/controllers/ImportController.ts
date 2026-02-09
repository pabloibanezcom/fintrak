import type {
  Currency,
  Periodicity,
  RecurringTransactionPeriodicity,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import CategoryModel from '../models/CategoryModel';
import CounterpartyModel from '../models/CounterpartyModel';
import CryptoAssetModel from '../models/CryptoAssetModel';
import RecurringTransactionModel from '../models/RecurringTransactionModel';
import TagModel from '../models/TagModel';
import UserTransactionModel from '../models/UserTransactionModel';
import { GenericImportService } from '../services/GenericImportService';
import { requireAuth } from '../utils/authUtils';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Helper to handle import errors with proper status codes
 */
const handleImportError = (
  res: Response,
  error: unknown,
  entityName: string
) => {
  console.error(`${entityName} import error:`, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  // Return 400 for validation errors (invalid JSON/format)
  const statusCode =
    errorMessage.includes('Invalid JSON') ||
    errorMessage.includes('Invalid format')
      ? 400
      : 500;
  res.status(statusCode).json({
    error: statusCode === 400 ? errorMessage : `Failed to import ${entityName}`,
    ...(statusCode === 400 && { details: errorMessage }),
  });
};

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
    const userId = requireAuth(req, res);
    if (!userId) return;

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

        // Fallback: use "otros" (Other) category, create if doesn't exist
        let category = await CategoryModel.findOne({
          userId,
          key: 'otros',
        });

        if (!category) {
          category = await CategoryModel.create({
            key: 'otros',
            name: {
              en: 'Other',
              es: 'Otros',
            },
            color: '#6B7280',
            icon: 'other',
            userId,
          });
        }

        // Generate title based on counterparty (will be set after counterparty detection)
        let transactionTitle = cleanDescription; // Default fallback

        const transactionData: any = {
          title: transactionTitle, // Will be updated after counterparty detection
          amount: absAmount,
          currency: (row.currency || 'EUR') as Currency,
          category: category._id,
          date: transactionDate,
          periodicity: row.periodicity || ('NOT_RECURRING' as Periodicity),
          // Remove description for now - let user add manually if needed
          userId,
        };

        // Smart counterparty detection based on transaction description
        let counterparty: any = null;

        // Get all user counterparties
        const userCounterparties = await CounterpartyModel.find({ userId });

        // Find best matching counterparty based on name similarity
        let bestCounterpartyMatch: {
          counterparty: any;
          similarity: number;
        } | null = null;

        for (const cp of userCounterparties) {
          const counterpartyName = cp.name.toLowerCase();
          const descriptionLower = cleanDescription.toLowerCase();
          const movementTypeLower = (row.movement_type || '').toLowerCase();
          const searchText = `${descriptionLower} ${movementTypeLower}`.trim();

          // Check if counterparty name appears in description or movement type
          if (searchText.includes(counterpartyName)) {
            const similarity = counterpartyName.length; // Longer names get priority
            if (
              !bestCounterpartyMatch ||
              similarity > bestCounterpartyMatch.similarity
            ) {
              bestCounterpartyMatch = { counterparty: cp, similarity };
            }
          }
        }

        if (bestCounterpartyMatch) {
          counterparty = bestCounterpartyMatch.counterparty;
        } else {
          // Fallback: use "unknown" counterparty, create if doesn't exist
          counterparty = await CounterpartyModel.findOne({
            userId,
            key: 'unknown',
          });

          if (!counterparty) {
            counterparty = await CounterpartyModel.create({
              key: 'unknown',
              name: 'Desconocido',
              type: 'other',
              titleTemplate: 'Transacción {name}',
              userId,
            });
          }
        }

        // Generate transaction title based on counterparty
        if (counterparty.key !== 'unknown') {
          if (counterparty.titleTemplate) {
            // Use custom title template, replace {name} placeholder
            transactionTitle = counterparty.titleTemplate.replace(
              '{name}',
              counterparty.name
            );
          } else {
            // Fallback to generic title based on counterparty name and transaction type
            transactionTitle = isExpense
              ? `Compra ${counterparty.name}`
              : `Ingreso ${counterparty.name}`;
          }
        } else {
          // Keep original description for unknown counterparties
          transactionTitle = cleanDescription;
        }

        // Update transaction data with generated title
        transactionData.title = transactionTitle;

        // Add type and counterparty to transaction
        transactionData.type = isExpense ? 'expense' : 'income';
        transactionData.counterparty = counterparty._id;

        // Check for duplicate transactions (same user, date, amount, type, and original description)
        const duplicateQuery = {
          userId,
          date: transactionDate,
          amount: absAmount,
          type: transactionData.type,
          // Use original description for duplicate detection, not generated title
          title: cleanDescription,
        };

        // Remove existing duplicate and create new transaction
        await UserTransactionModel.deleteMany(duplicateQuery);
        await UserTransactionModel.create(transactionData);

        if (isExpense) {
          results.expenses++;
        } else {
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

export const importCategories = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = await GenericImportService.importFromJSON(
      req.file.buffer,
      userId,
      {
        model: CategoryModel,
        entityName: 'categories',
        arrayPropertyName: 'categories',
        requiredFields: ['key', 'name'],
        uniqueField: 'key',
        transformData: (rawData, userId) => ({
          key: rawData.key,
          name: rawData.name,
          color: rawData.color || '#6B7280',
          icon: rawData.icon || 'folder',
          keywords: rawData.keywords || [],
          userId,
        }),
      }
    );

    res.json(results);
  } catch (error) {
    handleImportError(res, error, 'categories');
  }
};

export const importTags = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = await GenericImportService.importFromJSON(
      req.file.buffer,
      userId,
      {
        model: TagModel,
        entityName: 'tags',
        arrayPropertyName: 'tags',
        requiredFields: ['key', 'name'],
        uniqueField: 'key',
        transformData: (rawData, userId) => ({
          key: rawData.key,
          name: rawData.name,
          color: rawData.color || '#6B7280',
          icon: rawData.icon || 'pricetag',
          userId,
        }),
      }
    );

    res.json(results);
  } catch (error) {
    handleImportError(res, error, 'tags');
  }
};

export const importCounterparties = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = await GenericImportService.importFromJSON(
      req.file.buffer,
      userId,
      {
        model: CounterpartyModel,
        entityName: 'counterparties',
        arrayPropertyName: 'counterparties',
        requiredFields: ['key', 'name'],
        uniqueField: 'key',
        customValidate: (rawData) => {
          // Validate type value if provided
          if (
            rawData.type &&
            !['company', 'person', 'institution', 'other'].includes(
              rawData.type
            )
          ) {
            return 'Invalid type value. Expected: company, person, institution, or other';
          }
          return undefined;
        },
        transformData: (rawData, userId) => ({
          key: rawData.key,
          name: rawData.name,
          type: rawData.type || 'other',
          logo: rawData.logo,
          email: rawData.email,
          phone: rawData.phone,
          address: rawData.address,
          notes: rawData.notes,
          titleTemplate: rawData.titleTemplate,
          userId,
        }),
      }
    );

    res.json(results);
  } catch (error) {
    handleImportError(res, error, 'counterparties');
  }
};

export const importRecurringTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = await GenericImportService.importFromJSON(
      req.file.buffer,
      userId,
      {
        model: RecurringTransactionModel,
        entityName: 'recurring transactions',
        arrayPropertyName: 'recurringTransactions',
        requiredFields: [
          'title',
          'currency',
          'category',
          'transactionType',
          'periodicity',
        ],
        uniqueField: 'title', // Note: actual uniqueness is composite (title + periodicity)
        customValidate: (rawData) => {
          // Validate currency
          if (!['EUR', 'GBP', 'USD'].includes(rawData.currency)) {
            return 'Invalid currency. Expected: EUR, GBP, or USD';
          }

          // Validate transaction type
          if (!['EXPENSE', 'INCOME'].includes(rawData.transactionType)) {
            return 'Invalid transaction type. Expected: EXPENSE or INCOME';
          }

          // Validate periodicity
          if (
            !['MONTHLY', 'QUARTERLY', 'YEARLY'].includes(rawData.periodicity)
          ) {
            return 'Invalid periodicity. Expected: MONTHLY, QUARTERLY, or YEARLY';
          }

          // Validate amount ranges
          if (
            rawData.minAproxAmount !== undefined &&
            rawData.minAproxAmount < 0
          ) {
            return 'minAproxAmount must be non-negative';
          }

          if (
            rawData.maxAproxAmount !== undefined &&
            rawData.maxAproxAmount < 0
          ) {
            return 'maxAproxAmount must be non-negative';
          }

          if (
            rawData.minAproxAmount !== undefined &&
            rawData.maxAproxAmount !== undefined &&
            rawData.minAproxAmount > rawData.maxAproxAmount
          ) {
            return 'minAproxAmount cannot be greater than maxAproxAmount';
          }

          return undefined;
        },
        findExisting: async (rawData, userId, model) => {
          // Use composite key for uniqueness check
          return model.findOne({
            userId,
            title: rawData.title,
            periodicity: rawData.periodicity,
          });
        },
        transformData: async (rawData, userId) => {
          // Find or create category
          let category = await CategoryModel.findOne({
            userId,
            key: rawData.category,
          });

          if (!category) {
            // Category doesn't exist, create a basic one
            category = await CategoryModel.create({
              key: rawData.category,
              name:
                rawData.category.charAt(0).toUpperCase() +
                rawData.category.slice(1),
              color: '#6B7280',
              icon: 'folder',
              keywords: [],
              userId,
            });
          }

          return {
            title: rawData.title,
            currency: rawData.currency as Currency,
            category: category._id,
            transactionType: rawData.transactionType,
            minAproxAmount: rawData.minAproxAmount,
            maxAproxAmount: rawData.maxAproxAmount,
            periodicity: rawData.periodicity as RecurringTransactionPeriodicity,
            userId,
          };
        },
      }
    );

    res.json(results);
  } catch (error) {
    handleImportError(res, error, 'recurring transactions');
  }
};

export const importCryptoAssets = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = await GenericImportService.importFromJSON(
      req.file.buffer,
      userId,
      {
        model: CryptoAssetModel,
        entityName: 'crypto assets',
        arrayPropertyName: 'cryptoAssets',
        requiredFields: ['code', 'name'],
        uniqueField: 'code',
        customValidate: (rawData) => {
          // Validate amount if provided
          if (rawData.amount !== undefined && rawData.amount < 0) {
            return 'Amount must be non-negative';
          }
          return undefined;
        },
        transformData: (rawData, userId) => ({
          name: rawData.name,
          code: rawData.code,
          amount: rawData.amount || 0,
          userId,
        }),
      }
    );

    res.json(results);
  } catch (error) {
    handleImportError(res, error, 'crypto assets');
  }
};

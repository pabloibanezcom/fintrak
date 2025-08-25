import type { Currency, Periodicity } from '@fintrak/types';
import type { Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import CategoryModel from '../models/CategoryModel';
import CounterpartyModel from '../models/CounterpartyModel';
import ExpenseModel from '../models/ExpenseModel';
import IncomeModel from '../models/IncomeModel';
import TagModel from '../models/TagModel';

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

        // Smart category detection based on keywords
        let category: any = null;
        const description = cleanDescription.toLowerCase();
        const movementType = (row.movement_type || '').toLowerCase();
        const searchText = `${description} ${movementType}`.trim();

        // Get all user categories with keywords
        const userCategories = await CategoryModel.find({
          userId,
          keywords: { $exists: true, $not: { $size: 0 } },
        });

        // Find best matching category based on keywords
        let bestMatch: { category: any; matches: number } | null = null;

        for (const cat of userCategories) {
          if (cat.keywords && cat.keywords.length > 0) {
            let matches = 0;
            for (const keyword of cat.keywords) {
              if (searchText.includes(keyword.toLowerCase())) {
                matches++;
              }
            }
            if (matches > 0 && (!bestMatch || matches > bestMatch.matches)) {
              bestMatch = { category: cat, matches };
            }
          }
        }

        if (bestMatch) {
          category = bestMatch.category;
        } else {
          // Fallback: use "otros" category, create if doesn't exist
          category = await CategoryModel.findOne({
            userId,
            key: 'otros',
          });

          if (!category) {
            category = await CategoryModel.create({
              key: 'otros',
              name: 'Otros',
              color: '#6B7280',
              icon: 'help-circle',
              keywords: [],
              userId,
            });
          }
        }

        const transactionData: any = {
          title: cleanDescription,
          amount: absAmount,
          currency: (row.currency || 'EUR') as Currency,
          category: category._id,
          date: transactionDate,
          periodicity: row.periodicity || ('NOT_RECURRING' as Periodicity),
          description: isBBVAFormat
            ? `${row.movement_type} - ${cleanDescription}${row.observations ? ` (${row.observations})` : ''}`
            : `Imported from Excel - ${cleanDescription}`,
          userId,
        };

        // Use "unknown" counterparty for all imported transactions
        let counterparty = await CounterpartyModel.findOne({
          userId,
          key: 'unknown',
        });

        if (!counterparty) {
          counterparty = await CounterpartyModel.create({
            key: 'unknown',
            name: 'Desconocido',
            type: 'other',
            userId,
          });
        }

        // Add counterparty reference to transaction
        if (isExpense) {
          transactionData.payee = counterparty._id;
        } else {
          transactionData.source = counterparty._id;
        }

        // Check for duplicate transactions (same user, date, amount, description)
        const duplicateQuery = {
          userId,
          date: transactionDate,
          amount: absAmount,
          title: cleanDescription,
        };

        if (isExpense) {
          // Remove existing duplicate expense if exists
          await ExpenseModel.deleteMany(duplicateQuery);
          await ExpenseModel.create(transactionData);
          results.expenses++;
        } else {
          // Remove existing duplicate income if exists
          await IncomeModel.deleteMany(duplicateQuery);
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

export const importCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse JSON file
    let categoriesData: any[];
    try {
      const fileContent = req.file.buffer.toString('utf-8');
      const parsedData = JSON.parse(fileContent);

      // Handle both array format and object with categories property
      categoriesData = Array.isArray(parsedData)
        ? parsedData
        : parsedData.categories;

      if (!Array.isArray(categoriesData)) {
        return res.status(400).json({
          error:
            'Invalid JSON format. Expected array of categories or object with categories property',
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid JSON file',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    const results = {
      total: categoriesData.length,
      imported: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < categoriesData.length; i++) {
      try {
        const categoryData = categoriesData[i];

        // Validate required fields
        if (!categoryData.key || !categoryData.name) {
          results.errors.push(
            `Row ${i + 1}: Missing required fields (key, name)`
          );
          continue;
        }

        // Check if category already exists
        const existingCategory = await CategoryModel.findOne({
          userId,
          key: categoryData.key,
        });

        const categoryDoc = {
          key: categoryData.key,
          name: categoryData.name,
          color: categoryData.color || '#6B7280',
          icon: categoryData.icon || 'folder',
          keywords: categoryData.keywords || [],
          userId,
        };

        if (existingCategory) {
          // Replace existing category (delete and recreate to ensure complete replacement)
          await CategoryModel.deleteOne({ userId, key: categoryData.key });
          await CategoryModel.create(categoryDoc);
          results.updated++;
        } else {
          // Create new category
          await CategoryModel.create(categoryDoc);
          results.imported++;
        }
      } catch (error) {
        results.errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Category import error:', error);
    res.status(500).json({
      error: 'Failed to import categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const importTags = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse JSON file
    let tagsData: any[];
    try {
      const fileContent = req.file.buffer.toString('utf-8');
      const parsedData = JSON.parse(fileContent);

      // Handle both array format and object with tags property
      tagsData = Array.isArray(parsedData) ? parsedData : parsedData.tags;

      if (!Array.isArray(tagsData)) {
        return res.status(400).json({
          error:
            'Invalid JSON format. Expected array of tags or object with tags property',
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid JSON file',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    const results = {
      total: tagsData.length,
      imported: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < tagsData.length; i++) {
      try {
        const tagData = tagsData[i];

        // Validate required fields
        if (!tagData.key || !tagData.name) {
          results.errors.push(
            `Row ${i + 1}: Missing required fields (key, name)`
          );
          continue;
        }

        // Check if tag already exists
        const existingTag = await TagModel.findOne({
          userId,
          key: tagData.key,
        });

        const tagDoc = {
          key: tagData.key,
          name: tagData.name,
          color: tagData.color || '#6B7280',
          icon: tagData.icon || 'pricetag',
          userId,
        };

        if (existingTag) {
          // Replace existing tag (delete and recreate to ensure complete replacement)
          await TagModel.deleteOne({ userId, key: tagData.key });
          await TagModel.create(tagDoc);
          results.updated++;
        } else {
          // Create new tag
          await TagModel.create(tagDoc);
          results.imported++;
        }
      } catch (error) {
        results.errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Tag import error:', error);
    res.status(500).json({
      error: 'Failed to import tags',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const importCounterparties = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse JSON file
    let counterpartiesData: any[];
    try {
      const fileContent = req.file.buffer.toString('utf-8');
      const parsedData = JSON.parse(fileContent);

      // Handle both array format and object with counterparties property
      counterpartiesData = Array.isArray(parsedData)
        ? parsedData
        : parsedData.counterparties;

      if (!Array.isArray(counterpartiesData)) {
        return res.status(400).json({
          error:
            'Invalid JSON format. Expected array of counterparties or object with counterparties property',
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid JSON file',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    const results = {
      total: counterpartiesData.length,
      imported: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < counterpartiesData.length; i++) {
      try {
        const counterpartyData = counterpartiesData[i];

        // Validate required fields
        if (!counterpartyData.key || !counterpartyData.name) {
          results.errors.push(
            `Row ${i + 1}: Missing required fields (key, name)`
          );
          continue;
        }

        // Validate type value if provided
        if (
          counterpartyData.type &&
          !['company', 'person', 'institution', 'other'].includes(
            counterpartyData.type
          )
        ) {
          results.errors.push(
            `Row ${i + 1}: Invalid type value. Expected: company, person, institution, or other`
          );
          continue;
        }

        // Check if counterparty already exists
        const existingCounterparty = await CounterpartyModel.findOne({
          userId,
          key: counterpartyData.key,
        });

        const counterpartyDoc = {
          key: counterpartyData.key,
          name: counterpartyData.name,
          type: counterpartyData.type || 'other',
          logo: counterpartyData.logo,
          email: counterpartyData.email,
          phone: counterpartyData.phone,
          address: counterpartyData.address,
          notes: counterpartyData.notes,
          userId,
        };

        if (existingCounterparty) {
          // Replace existing counterparty (delete and recreate to ensure complete replacement)
          await CounterpartyModel.deleteOne({
            userId,
            key: counterpartyData.key,
          });
          await CounterpartyModel.create(counterpartyDoc);
          results.updated++;
        } else {
          // Create new counterparty
          await CounterpartyModel.create(counterpartyDoc);
          results.imported++;
        }
      } catch (error) {
        results.errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Counterparty import error:', error);
    res.status(500).json({
      error: 'Failed to import counterparties',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

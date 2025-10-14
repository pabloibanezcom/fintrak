import type { Model } from 'mongoose';

export interface ImportResult {
  total: number;
  imported: number;
  updated: number;
  errors: string[];
}

export interface ImportConfig<T> {
  /** The Mongoose model to use for importing */
  model: Model<any>;
  /** Name of the entity being imported (for error messages) */
  entityName: string;
  /** Property name in the JSON file (e.g., 'categories', 'tags') */
  arrayPropertyName: string;
  /** Required fields that must be present in each item */
  requiredFields: (keyof T)[];
  /** The unique identifier field (e.g., 'key', 'code'). Can be a single field or composite */
  uniqueField: keyof T | (keyof T)[];
  /** Transform function to convert raw data to document format (can be async for complex transformations) */
  transformData: (rawData: any, userId: string) => any | Promise<any>;
  /** Optional custom validation function. Returns error message if invalid, undefined if valid */
  customValidate?: (rawData: any) => string | undefined;
  /** Optional custom function to find existing item (for composite keys or complex lookups) */
  findExisting?: (
    rawData: any,
    userId: string,
    model: Model<any>
  ) => Promise<any>;
}

/**
 * Generic service for importing JSON data into MongoDB collections
 * Handles file parsing, validation, duplicate detection, and error reporting
 */
export class GenericImportService {
  /**
   * Import data from a JSON file buffer
   * @param fileBuffer - The uploaded file buffer
   * @param userId - The user ID to associate with imported items
   * @param config - Configuration for the import operation
   * @returns Import results with counts and errors
   */
  static async importFromJSON<T>(
    fileBuffer: Buffer,
    userId: string,
    config: ImportConfig<T>
  ): Promise<ImportResult> {
    // Parse JSON file
    let data: any[];
    try {
      const fileContent = fileBuffer.toString('utf-8');
      const parsedData = JSON.parse(fileContent);

      // Handle both array format and object with property
      data = Array.isArray(parsedData)
        ? parsedData
        : parsedData[config.arrayPropertyName];

      if (!Array.isArray(data)) {
        throw new Error(
          `Invalid JSON format. Expected array of ${config.entityName} or object with ${config.arrayPropertyName} property`
        );
      }
    } catch (error) {
      throw new Error(
        `Invalid JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    const results: ImportResult = {
      total: data.length,
      imported: 0,
      updated: 0,
      errors: [],
    };

    // Process each item
    for (let i = 0; i < data.length; i++) {
      try {
        const rawData = data[i];

        // Validate required fields
        const missingFields = config.requiredFields.filter(
          (field) => !rawData[field as string]
        );

        if (missingFields.length > 0) {
          results.errors.push(
            `Row ${i + 1}: Missing required fields (${missingFields.join(', ')})`
          );
          continue;
        }

        // Custom validation if provided
        if (config.customValidate) {
          const validationError = config.customValidate(rawData);
          if (validationError) {
            results.errors.push(`Row ${i + 1}: ${validationError}`);
            continue;
          }
        }

        // Check if item already exists
        let existingItem: any;
        if (config.findExisting) {
          // Use custom find logic
          existingItem = await config.findExisting(
            rawData,
            userId,
            config.model
          );
        } else {
          // Use default uniqueField lookup
          const uniqueField = config.uniqueField as string;
          const uniqueValue = rawData[uniqueField];
          existingItem = await config.model.findOne({
            userId,
            [uniqueField]: uniqueValue,
          });
        }

        // Transform raw data to document format (await in case it's async)
        const documentData = await config.transformData(rawData, userId);

        if (existingItem) {
          // Replace existing item (delete by _id and recreate to ensure complete replacement)
          await config.model.deleteOne({ _id: existingItem._id });
          await config.model.create(documentData);
          results.updated++;
        } else {
          // Create new item
          await config.model.create(documentData);
          results.imported++;
        }
      } catch (error) {
        results.errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return results;
  }
}

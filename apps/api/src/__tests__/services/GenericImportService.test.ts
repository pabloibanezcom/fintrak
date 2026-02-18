import { GenericImportService, type ImportConfig } from '../../services/GenericImportService';

interface TestEntity {
  key: string;
  name: string;
}

describe('GenericImportService', () => {
  const userId = 'user-123';

  const createConfig = (
    overrides: Partial<ImportConfig<TestEntity>> = {}
  ): ImportConfig<TestEntity> => {
    const model = {
      findOne: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };

    return {
      model: model as any,
      entityName: 'category',
      arrayPropertyName: 'categories',
      requiredFields: ['key', 'name'],
      uniqueField: 'key',
      transformData: (raw: any, uid: string) => ({
        key: raw.key,
        name: raw.name,
        userId: uid,
      }),
      ...overrides,
    };
  };

  it('should import new items from an object array property', async () => {
    const config = createConfig();
    (config.model.findOne as jest.Mock).mockResolvedValue(null);
    (config.model.create as jest.Mock).mockResolvedValue({});

    const fileBuffer = Buffer.from(
      JSON.stringify({
        categories: [
          { key: 'food', name: 'Food' },
          { key: 'travel', name: 'Travel' },
        ],
      })
    );

    const result = await GenericImportService.importFromJSON(
      fileBuffer,
      userId,
      config
    );

    expect(result).toEqual({
      total: 2,
      imported: 2,
      updated: 0,
      errors: [],
    });
    expect(config.model.findOne).toHaveBeenCalledTimes(2);
    expect(config.model.create).toHaveBeenCalledTimes(2);
  });

  it('should update existing items by replacing documents', async () => {
    const config = createConfig();
    (config.model.findOne as jest.Mock).mockResolvedValue({ _id: 'old-id' });
    (config.model.deleteOne as jest.Mock).mockResolvedValue({});
    (config.model.create as jest.Mock).mockResolvedValue({});

    const fileBuffer = Buffer.from(
      JSON.stringify([{ key: 'food', name: 'Updated Food' }])
    );

    const result = await GenericImportService.importFromJSON(
      fileBuffer,
      userId,
      config
    );

    expect(result).toEqual({
      total: 1,
      imported: 0,
      updated: 1,
      errors: [],
    });
    expect(config.model.deleteOne).toHaveBeenCalledWith({ _id: 'old-id' });
    expect(config.model.create).toHaveBeenCalledWith({
      key: 'food',
      name: 'Updated Food',
      userId,
    });
  });

  it('should collect row errors for missing required fields and custom validation', async () => {
    const config = createConfig({
      customValidate: (raw) => {
        if (raw.key === 'blocked') return 'Key is blocked';
        return undefined;
      },
    });
    (config.model.findOne as jest.Mock).mockResolvedValue(null);
    (config.model.create as jest.Mock).mockResolvedValue({});

    const fileBuffer = Buffer.from(
      JSON.stringify([
        { key: '', name: 'Invalid Missing Key' },
        { key: 'blocked', name: 'Blocked category' },
        { key: 'ok', name: 'Valid category' },
      ])
    );

    const result = await GenericImportService.importFromJSON(
      fileBuffer,
      userId,
      config
    );

    expect(result.total).toBe(3);
    expect(result.imported).toBe(1);
    expect(result.updated).toBe(0);
    expect(result.errors).toEqual([
      'Row 1: Missing required fields (key)',
      'Row 2: Key is blocked',
    ]);
  });

  it('should use custom findExisting when provided', async () => {
    const config = createConfig({
      findExisting: jest.fn().mockResolvedValue(null),
    });
    (config.model.create as jest.Mock).mockResolvedValue({});

    const fileBuffer = Buffer.from(
      JSON.stringify([{ key: 'custom', name: 'Custom find' }])
    );

    await GenericImportService.importFromJSON(fileBuffer, userId, config);

    expect(config.findExisting).toHaveBeenCalledWith(
      { key: 'custom', name: 'Custom find' },
      userId,
      config.model
    );
    expect(config.model.findOne).not.toHaveBeenCalled();
  });

  it('should throw for invalid JSON payloads', async () => {
    const config = createConfig();
    const invalidBuffer = Buffer.from('not-json');

    await expect(
      GenericImportService.importFromJSON(invalidBuffer, userId, config)
    ).rejects.toThrow('Invalid JSON file');
  });
});

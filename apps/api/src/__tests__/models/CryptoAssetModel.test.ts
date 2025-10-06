import CryptoAssetModel, {
  type ICryptoAsset,
} from '../../models/CryptoAssetModel';

describe('CryptoAssetModel', () => {
  const validCryptoAssetData = {
    name: 'Bitcoin',
    code: 'BTC',
    amount: 0.5,
    userId: 'user123',
  };

  it('should create a crypto asset successfully', async () => {
    const cryptoAsset: ICryptoAsset = new CryptoAssetModel(
      validCryptoAssetData
    );
    const savedCryptoAsset = await cryptoAsset.save();

    expect(savedCryptoAsset.name).toBe(validCryptoAssetData.name);
    expect(savedCryptoAsset.code).toBe(validCryptoAssetData.code);
    expect(savedCryptoAsset.amount).toBe(validCryptoAssetData.amount);
    expect(savedCryptoAsset.userId).toBe(validCryptoAssetData.userId);
    expect(savedCryptoAsset.createdAt).toBeDefined();
    expect(savedCryptoAsset.updatedAt).toBeDefined();
    expect(savedCryptoAsset._id).toBeDefined();
  });

  it('should require name field', async () => {
    const cryptoAssetData = { ...validCryptoAssetData } as any;
    delete cryptoAssetData.name;
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);

    await expect(cryptoAsset.save()).rejects.toThrow();
  });

  it('should require code field', async () => {
    const cryptoAssetData = { ...validCryptoAssetData } as any;
    delete cryptoAssetData.code;
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);

    await expect(cryptoAsset.save()).rejects.toThrow();
  });

  it('should require amount field', async () => {
    const cryptoAssetData = { ...validCryptoAssetData } as any;
    delete cryptoAssetData.amount;
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);

    await expect(cryptoAsset.save()).rejects.toThrow();
  });

  it('should require userId field', async () => {
    const cryptoAssetData = { ...validCryptoAssetData } as any;
    delete cryptoAssetData.userId;
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);

    await expect(cryptoAsset.save()).rejects.toThrow();
  });

  it('should enforce minimum amount of 0', async () => {
    const cryptoAssetData = {
      ...validCryptoAssetData,
      amount: -1,
    };
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);

    await expect(cryptoAsset.save()).rejects.toThrow();
  });

  it('should allow amount of 0', async () => {
    const cryptoAssetData = {
      ...validCryptoAssetData,
      amount: 0,
    };
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);
    const savedCryptoAsset = await cryptoAsset.save();

    expect(savedCryptoAsset.amount).toBe(0);
  });

  it('should allow different users to have the same crypto code', async () => {
    const cryptoAsset1 = new CryptoAssetModel(validCryptoAssetData);
    await cryptoAsset1.save();

    const cryptoAsset2 = new CryptoAssetModel({
      ...validCryptoAssetData,
      userId: 'user456',
    });
    const savedCryptoAsset2 = await cryptoAsset2.save();

    expect(savedCryptoAsset2.code).toBe(validCryptoAssetData.code);
    expect(savedCryptoAsset2.userId).toBe('user456');
  });

  it('should allow same user to have multiple entries for the same crypto', async () => {
    const cryptoAsset1 = new CryptoAssetModel(validCryptoAssetData);
    await cryptoAsset1.save();

    const cryptoAsset2 = new CryptoAssetModel({
      ...validCryptoAssetData,
      amount: 1.5,
    });
    const savedCryptoAsset2 = await cryptoAsset2.save();

    expect(savedCryptoAsset2.code).toBe(validCryptoAssetData.code);
    expect(savedCryptoAsset2.userId).toBe(validCryptoAssetData.userId);
    expect(savedCryptoAsset2.amount).toBe(1.5);
  });

  it('should transform toJSON output correctly', async () => {
    const cryptoAsset = new CryptoAssetModel(validCryptoAssetData);
    const savedCryptoAsset = await cryptoAsset.save();
    const json = savedCryptoAsset.toJSON();

    expect(json.id).toBeDefined();
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();
    expect(json.userId).toBeUndefined();
    expect(json.name).toBe(validCryptoAssetData.name);
    expect(json.code).toBe(validCryptoAssetData.code);
    expect(json.amount).toBe(validCryptoAssetData.amount);
  });

  it('should update timestamps on modification', async () => {
    const cryptoAsset = new CryptoAssetModel(validCryptoAssetData);
    const savedCryptoAsset = await cryptoAsset.save();
    const originalUpdatedAt = savedCryptoAsset.updatedAt;

    // Wait a moment to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 10));

    savedCryptoAsset.amount = 1.0;
    const updatedCryptoAsset = await savedCryptoAsset.save();

    expect(updatedCryptoAsset.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should handle decimal amounts correctly', async () => {
    const cryptoAssetData = {
      ...validCryptoAssetData,
      amount: 0.123456789,
    };
    const cryptoAsset = new CryptoAssetModel(cryptoAssetData);
    const savedCryptoAsset = await cryptoAsset.save();

    expect(savedCryptoAsset.amount).toBe(0.123456789);
  });

  it('should create index on userId', async () => {
    const indexes = await CryptoAssetModel.collection.getIndexes();
    const userIdIndex = Object.keys(indexes).find((key) =>
      key.includes('userId')
    );

    expect(userIdIndex).toBeDefined();
  });
});

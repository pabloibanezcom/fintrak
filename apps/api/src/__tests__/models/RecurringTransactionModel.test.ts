import { Types } from 'mongoose';
import RecurringTransactionModel, {
  type IRecurringTransaction,
} from '../../models/RecurringTransactionModel';

describe('RecurringTransactionModel', () => {
  const categoryId = new Types.ObjectId();
  const validRecurringTransactionData = {
    title: 'Monthly Mortgage',
    currency: 'EUR' as const,
    category: categoryId,
    transactionType: 'EXPENSE' as const,
    minAproxAmount: 1000,
    maxAproxAmount: 1100,
    periodicity: 'MONTHLY' as const,
    userId: 'user123',
  };

  it('should create a recurring transaction successfully', async () => {
    const recurringTransaction: IRecurringTransaction =
      new RecurringTransactionModel(validRecurringTransactionData);
    const savedRecurringTransaction = await recurringTransaction.save();

    expect(savedRecurringTransaction.title).toBe(
      validRecurringTransactionData.title
    );
    expect(savedRecurringTransaction.currency).toBe(
      validRecurringTransactionData.currency
    );
    expect(savedRecurringTransaction.category).toBe(
      validRecurringTransactionData.category
    );
    expect(savedRecurringTransaction.transactionType).toBe(
      validRecurringTransactionData.transactionType
    );
    expect(savedRecurringTransaction.minAproxAmount).toBe(
      validRecurringTransactionData.minAproxAmount
    );
    expect(savedRecurringTransaction.maxAproxAmount).toBe(
      validRecurringTransactionData.maxAproxAmount
    );
    expect(savedRecurringTransaction.periodicity).toBe(
      validRecurringTransactionData.periodicity
    );
    expect(savedRecurringTransaction.userId).toBe(
      validRecurringTransactionData.userId
    );
    expect(savedRecurringTransaction.createdAt).toBeDefined();
    expect(savedRecurringTransaction.updatedAt).toBeDefined();
    expect(savedRecurringTransaction._id).toBeDefined();
  });

  it('should require title field', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
    } as any;
    delete recurringTransactionData.title;
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should require currency field', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
    } as any;
    delete recurringTransactionData.currency;
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should require category field', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
    } as any;
    delete recurringTransactionData.category;
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should require transactionType field', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
    } as any;
    delete recurringTransactionData.transactionType;
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should require periodicity field', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
    } as any;
    delete recurringTransactionData.periodicity;
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should require userId field', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
    } as any;
    delete recurringTransactionData.userId;
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should validate currency enum', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
      currency: 'INVALID' as any,
    };
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should validate transactionType enum', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
      transactionType: 'INVALID' as any,
    };
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should validate periodicity enum', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
      periodicity: 'INVALID' as any,
    };
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should allow optional minAproxAmount and maxAproxAmount', async () => {
    const recurringTransactionData = { ...validRecurringTransactionData };
    delete (recurringTransactionData as any).minAproxAmount;
    delete (recurringTransactionData as any).maxAproxAmount;

    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );
    const savedRecurringTransaction = await recurringTransaction.save();

    expect(savedRecurringTransaction.minAproxAmount).toBeUndefined();
    expect(savedRecurringTransaction.maxAproxAmount).toBeUndefined();
  });

  it('should validate positive amounts when provided', async () => {
    const recurringTransactionData = {
      ...validRecurringTransactionData,
      minAproxAmount: -100,
    };
    const recurringTransaction = new RecurringTransactionModel(
      recurringTransactionData
    );

    await expect(recurringTransaction.save()).rejects.toThrow();
  });

  it('should create correct indexes', () => {
    const indexes = RecurringTransactionModel.schema.indexes();

    // Check if compound index exists (userId + transactionType)
    const compoundIndex = indexes.find(
      (index) =>
        index[0].userId === 1 &&
        index[0].transactionType === 1 &&
        index[1].background === true
    );
    expect(compoundIndex).toBeDefined();
    expect(indexes.length).toBeGreaterThan(0);
  });

  it('should transform toJSON correctly', () => {
    const recurringTransaction = new RecurringTransactionModel(
      validRecurringTransactionData
    );
    const jsonData = recurringTransaction.toJSON();

    expect(jsonData.id).toBeDefined();
    expect(jsonData._id).toBeUndefined();
    expect(jsonData.__v).toBeUndefined();
    expect(jsonData.userId).toBeUndefined();
    expect(jsonData.title).toBe(validRecurringTransactionData.title);
  });
});

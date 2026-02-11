import mongoose from 'mongoose';
import {
  convertStringToObjectId,
  prepareAggregationQuery,
} from '../../utils/mongoUtils';

describe('mongoUtils', () => {
  it('converts valid object id strings and leaves invalid strings unchanged', () => {
    const valid = new mongoose.Types.ObjectId().toString();
    const converted = convertStringToObjectId(valid);

    expect(converted).toBeInstanceOf(mongoose.Types.ObjectId);
    expect((converted as mongoose.Types.ObjectId).toString()).toBe(valid);

    const invalid = 'not-an-object-id';
    expect(convertStringToObjectId(invalid)).toBe(invalid);
  });

  it('prepares aggregation query by converting configured fields only', () => {
    const validUserId = new mongoose.Types.ObjectId().toString();
    const originalQuery = {
      userId: validUserId,
      accountId: 'not-an-object-id',
      amount: { $gte: 100 },
      nested: { keep: true },
    };

    const result = prepareAggregationQuery(originalQuery, ['userId', 'accountId']);

    expect(result.userId).toBeInstanceOf(mongoose.Types.ObjectId);
    expect((result.userId as mongoose.Types.ObjectId).toString()).toBe(validUserId);
    expect(result.accountId).toBe('not-an-object-id');
    expect(result.amount).toEqual({ $gte: 100 });
    expect(result.nested).toEqual({ keep: true });
  });

  it('does not mutate the original query object', () => {
    const validTagId = new mongoose.Types.ObjectId().toString();
    const query = { tagId: validTagId };

    const result = prepareAggregationQuery(query, ['tagId']);

    expect(result).not.toBe(query);
    expect(query.tagId).toBe(validTagId);
    expect(result.tagId).toBeInstanceOf(mongoose.Types.ObjectId);
  });

  it('does not convert non-string fields even when configured', () => {
    const query = {
      counterpartyId: { $in: ['a', 'b'] },
      userId: 12345,
    } as Record<string, unknown>;

    const result = prepareAggregationQuery(query, ['counterpartyId', 'userId']);

    expect(result.counterpartyId).toEqual({ $in: ['a', 'b'] });
    expect(result.userId).toBe(12345);
  });
});

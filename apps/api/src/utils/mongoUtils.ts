import mongoose from 'mongoose';

export const convertStringToObjectId = (
  value: string
): mongoose.Types.ObjectId | string => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  return value;
};

export const prepareAggregationQuery = (
  query: Record<string, any>,
  fieldsToConvert: string[]
): Record<string, any> => {
  const aggregationQuery = { ...query };

  fieldsToConvert.forEach((field) => {
    if (
      aggregationQuery[field] &&
      typeof aggregationQuery[field] === 'string'
    ) {
      aggregationQuery[field] = convertStringToObjectId(
        aggregationQuery[field]
      );
    }
  });

  return aggregationQuery;
};

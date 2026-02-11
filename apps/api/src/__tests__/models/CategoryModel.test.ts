import CategoryModel, { type ICategory } from '../../models/CategoryModel';

describe('CategoryModel', () => {
  const validCategoryData = {
    key: 'food',
    name: {
      en: 'Food & Dining',
      es: 'Comida y Restaurantes',
    },
    color: '#ff0000',
    icon: 'restaurant',
    userId: 'user123',
  };

  beforeAll(async () => {
    await CategoryModel.init();
  });

  it('should create a category successfully', async () => {
    const category: ICategory = new CategoryModel(validCategoryData);
    const savedCategory = await category.save();

    expect(savedCategory.key).toBe(validCategoryData.key);
    expect(savedCategory.name.en).toBe(validCategoryData.name.en);
    expect(savedCategory.name.es).toBe(validCategoryData.name.es);
    expect(savedCategory.color).toBe(validCategoryData.color);
    expect(savedCategory.icon).toBe(validCategoryData.icon);
    expect(savedCategory.userId).toBe(validCategoryData.userId);
    expect(savedCategory.createdAt).toBeDefined();
    expect(savedCategory.updatedAt).toBeDefined();
    expect(savedCategory._id).toBeDefined();
  });

  it('should require key field', async () => {
    const categoryData = { ...validCategoryData } as any;
    delete categoryData.key;
    const category = new CategoryModel(categoryData);

    await expect(category.save()).rejects.toThrow();
  });

  it('should require name field', async () => {
    const categoryData = { ...validCategoryData } as any;
    delete categoryData.name;
    const category = new CategoryModel(categoryData);

    await expect(category.save()).rejects.toThrow();
  });

  it('should require userId field', async () => {
    const categoryData = { ...validCategoryData } as any;
    delete categoryData.userId;
    const category = new CategoryModel(categoryData);

    await expect(category.save()).rejects.toThrow();
  });

  it('should enforce unique constraint on userId and key combination', async () => {
    const category1 = new CategoryModel(validCategoryData);
    await category1.save();

    const category2 = new CategoryModel(validCategoryData);
    await expect(category2.save()).rejects.toThrow();
  });

  it('should allow same key for different users', async () => {
    const category1 = new CategoryModel(validCategoryData);
    await category1.save();

    const category2 = new CategoryModel({
      ...validCategoryData,
      userId: 'user456',
    });
    const savedCategory2 = await category2.save();

    expect(savedCategory2.key).toBe(validCategoryData.key);
    expect(savedCategory2.userId).toBe('user456');
  });

  it('should ignore unknown fields like keywords', async () => {
    const categoryWithKeywords = {
      ...validCategoryData,
      keywords: ['restaurant', 'dining', 'eat'],
    };

    const category = new CategoryModel(categoryWithKeywords);
    const savedCategory = await category.save();

    expect((savedCategory as any).keywords).toBeUndefined();
  });

  it('should update timestamps on modification', async () => {
    const category = new CategoryModel(validCategoryData);
    const savedCategory = await category.save();
    const originalUpdatedAt = savedCategory.updatedAt;

    // Wait a moment to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 10));

    savedCategory.name = {
      en: 'Updated Food & Dining',
      es: 'Comida y Restaurantes Actualizada',
    };
    const updatedCategory = await savedCategory.save();

    expect(updatedCategory.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});

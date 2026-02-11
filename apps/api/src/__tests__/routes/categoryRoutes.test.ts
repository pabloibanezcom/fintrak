import request from 'supertest';
import CategoryModel from '../../models/CategoryModel';
import { createTestApp } from '../testApp';

const app = createTestApp();

describe('Category Routes Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Create and register a test user
    const userResponse = await request(app).post('/api/auth/register').send({
      email: 'category-test@example.com',
      password: 'password123',
    });

    userId = userResponse.body.id;

    // Login to get auth token
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'category-test@example.com',
      password: 'password123',
    });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return user categories sorted by name', async () => {
      // Create test categories
      await CategoryModel.create([
        {
          key: 'food',
          name: { en: 'Food', es: 'Comida' },
          color: '#ff0000',
          icon: 'restaurant',
          userId,
        },
        {
          key: 'transport',
          name: { en: 'Transport', es: 'Transporte' },
          color: '#00ff00',
          icon: 'car',
          userId,
        },
      ]);

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name.en).toBe('Food');
      expect(response.body[1].name.en).toBe('Transport');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Missing or invalid token');
    });

    it('should return 401 with invalid auth token', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid token');
    });
  });

  describe('GET /api/categories/:id', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await CategoryModel.create({
        key: 'food',
        name: { en: 'Food', es: 'Comida' },
        color: '#ff0000',
        icon: 'restaurant',
        userId,
      });
      categoryId = category.key;
    });

    it('should return specific category', async () => {
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.key).toBe(categoryId);
      expect(response.body.name.en).toBe('Food');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categories/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });

  describe('POST /api/categories', () => {
    const validCategoryData = {
      key: 'entertainment',
      name: { en: 'Entertainment', es: 'Entretenimiento' },
      color: '#0000ff',
      icon: 'movie',
    };

    it('should create category successfully', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCategoryData);

      expect(response.status).toBe(201);
      expect(response.body.key).toBe(validCategoryData.key);
      expect(response.body.name).toEqual(
        expect.objectContaining(validCategoryData.name)
      );

      // Verify in database
      const category = await CategoryModel.findOne({
        key: validCategoryData.key,
        userId,
      });
      expect(category).toBeTruthy();
    });

    it('should return 409 for duplicate category key', async () => {
      // Create first category
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCategoryData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCategoryData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'error',
        'Category with this ID already exists'
      );
    });
  });

  describe('PUT /api/categories/:id', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await CategoryModel.create({
        key: 'food',
        name: { en: 'Food', es: 'Comida' },
        color: '#ff0000',
        icon: 'restaurant',
        userId,
      });
      categoryId = category.key;
    });

    it('should update category successfully', async () => {
      const updateData = {
        name: { en: 'Food & Dining', es: 'Comida y Restaurantes' },
        color: '#ff5500',
      };

      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(
        expect.objectContaining(updateData.name)
      );
      expect(response.body.color).toBe(updateData.color);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .put('/api/categories/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: { en: 'Updated', es: 'Actualizado' } });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await CategoryModel.create({
        key: 'food',
        name: { en: 'Food', es: 'Comida' },
        color: '#ff0000',
        icon: 'restaurant',
        userId,
      });
      categoryId = category.key;
    });

    it('should delete category successfully', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Category deleted successfully'
      );

      // Verify deletion in database
      const category = await CategoryModel.findOne({ key: categoryId, userId });
      expect(category).toBeNull();
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .delete('/api/categories/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
});

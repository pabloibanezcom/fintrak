import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../app';
import CounterpartyModel from '../../models/CounterpartyModel';
import { connectDB, disconnectDB } from '../helpers/testDb';

describe('Counterparty Integration Tests', () => {
  let authToken: string;
  const testUserId = '507f1f77bcf86cd799439011';

  beforeAll(async () => {
    await connectDB();

    // Create test JWT token
    authToken = jwt.sign(
      { userId: testUserId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  beforeEach(async () => {
    await CounterpartyModel.deleteMany({});

    // Seed test data
    await CounterpartyModel.create([
      {
        key: 'amazon',
        name: 'Amazon',
        type: 'company',
        titleTemplate: 'Compra en {name}',
        email: 'support@amazon.com',
        phone: '+1-800-123-4567',
        address: 'Seattle, WA',
        notes: 'Online shopping platform',
        userId: testUserId,
      },
      {
        key: 'netflix',
        name: 'Netflix',
        type: 'company',
        titleTemplate: 'Suscripción {name}',
        email: 'help@netflix.com',
        phone: '+1-866-579-7172',
        address: 'Los Gatos, CA',
        notes: 'Streaming service subscription',
        userId: testUserId,
      },
      {
        key: 'mercadona',
        name: 'Mercadona',
        type: 'company',
        titleTemplate: 'Compra en {name}',
        email: 'atencion.cliente@mercadona.es',
        phone: '+34-900-123-456',
        address: 'Valencia, Spain',
        notes: 'Spanish supermarket chain',
        userId: testUserId,
      },
    ]);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('GET /api/counterparties/search', () => {
    it('should return all counterparties with default pagination', async () => {
      const response = await request(app)
        .get('/api/counterparties/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(3);
      expect(response.body.pagination).toEqual({
        total: 3,
        limit: 50,
        offset: 0,
        hasMore: false,
      });
      expect(response.body.sort).toEqual({
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('should filter counterparties by name (case-insensitive)', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?name=amazon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].name).toBe('Amazon');
      expect(response.body.filters.name).toBe('amazon');
    });

    it('should filter counterparties by type', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?type=company')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(3);
      response.body.counterparties.forEach((cp: any) => {
        expect(cp.type).toBe('company');
      });
    });

    it('should filter counterparties by email', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?email=netflix')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].email).toContain('netflix');
    });

    it('should filter counterparties by phone', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?phone=+34')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].phone).toContain('+34');
    });

    it('should filter counterparties by address', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?address=spain')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].address).toContain('Spain');
    });

    it('should filter counterparties by notes', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?notes=streaming')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].notes).toContain('streaming');
    });

    it('should filter counterparties by titleTemplate', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?titleTemplate=suscripción')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].titleTemplate).toContain(
        'Suscripción'
      );
    });

    it('should apply multiple filters simultaneously', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?name=amazon&type=company&notes=online')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.counterparties[0].name).toBe('Amazon');
      expect(response.body.filters).toEqual(
        expect.objectContaining({
          name: 'amazon',
          type: 'company',
          notes: 'online',
        })
      );
    });

    it('should sort counterparties by name ascending (default)', async () => {
      const response = await request(app)
        .get('/api/counterparties/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const names = response.body.counterparties.map((cp: any) => cp.name);
      expect(names).toEqual(['Amazon', 'Mercadona', 'Netflix']);
    });

    it('should sort counterparties by name descending', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?sortBy=name&sortOrder=desc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const names = response.body.counterparties.map((cp: any) => cp.name);
      expect(names).toEqual(['Netflix', 'Mercadona', 'Amazon']);
    });

    it('should sort counterparties by type', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?sortBy=type&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.counterparties.forEach((cp: any) => {
        expect(cp.type).toBe('company');
      });
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?limit=2&offset=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        total: 3,
        limit: 2,
        offset: 1,
        hasMore: false,
      });
    });

    it('should return hasMore true when there are more results', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?limit=1&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(1);
      expect(response.body.pagination.hasMore).toBe(true);
    });

    it('should return empty results for non-matching filters', async () => {
      const response = await request(app)
        .get('/api/counterparties/search?name=nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
      expect(response.body.pagination.hasMore).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      await request(app).get('/api/counterparties/search').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/counterparties/search')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should only return counterparties for the authenticated user', async () => {
      // Create counterparty for different user
      await CounterpartyModel.create({
        key: 'other-user-cp',
        name: 'Other User Counterparty',
        type: 'company',
        userId: 'different-user-id',
      });

      const response = await request(app)
        .get('/api/counterparties/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.counterparties).toHaveLength(3);
      response.body.counterparties.forEach((cp: any) => {
        expect(cp.userId).toBe(testUserId);
      });
    });
  });

  describe('GET /api/counterparties/:id', () => {
    it('should return specific counterparty by key', async () => {
      const response = await request(app)
        .get('/api/counterparties/amazon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.key).toBe('amazon');
      expect(response.body.name).toBe('Amazon');
      expect(response.body.titleTemplate).toBe('Compra en {name}');
    });

    it('should return 404 for non-existent counterparty', async () => {
      const response = await request(app)
        .get('/api/counterparties/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe('Counterparty not found');
    });

    it('should return 401 without authentication', async () => {
      await request(app).get('/api/counterparties/amazon').expect(401);
    });
  });

  describe('POST /api/counterparties', () => {
    it('should create new counterparty with titleTemplate', async () => {
      const newCounterparty = {
        key: 'spotify',
        name: 'Spotify',
        type: 'company',
        titleTemplate: 'Suscripción música {name}',
        email: 'support@spotify.com',
        notes: 'Music streaming service',
      };

      const response = await request(app)
        .post('/api/counterparties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCounterparty)
        .expect(201);

      expect(response.body.key).toBe('spotify');
      expect(response.body.titleTemplate).toBe('Suscripción música {name}');
      expect(response.body.userId).toBe(testUserId);
    });

    it('should return 409 for duplicate key', async () => {
      const duplicateCounterparty = {
        key: 'amazon',
        name: 'Amazon Duplicate',
        type: 'company',
      };

      const response = await request(app)
        .post('/api/counterparties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateCounterparty)
        .expect(409);

      expect(response.body.error).toBe(
        'Counterparty with this key already exists'
      );
    });
  });

  describe('PUT /api/counterparties/:id', () => {
    it('should update counterparty with new titleTemplate', async () => {
      const updateData = {
        titleTemplate: 'Compra actualizada en {name}',
        email: 'updated@amazon.com',
      };

      const response = await request(app)
        .put('/api/counterparties/amazon')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.titleTemplate).toBe('Compra actualizada en {name}');
      expect(response.body.email).toBe('updated@amazon.com');
      expect(response.body.name).toBe('Amazon'); // Should remain unchanged
    });

    it('should return 404 for non-existent counterparty', async () => {
      const response = await request(app)
        .put('/api/counterparties/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.error).toBe('Counterparty not found');
    });
  });

  describe('DELETE /api/counterparties/:id', () => {
    it('should delete counterparty successfully', async () => {
      const response = await request(app)
        .delete('/api/counterparties/amazon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Counterparty deleted successfully');

      // Verify it's deleted
      await request(app)
        .get('/api/counterparties/amazon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent counterparty', async () => {
      const response = await request(app)
        .delete('/api/counterparties/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe('Counterparty not found');
    });
  });
});

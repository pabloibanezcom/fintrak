import request from 'supertest';
import User from '../../models/UserModel';
import { createTestApp } from '../testApp';

const app = createTestApp();

describe('Auth Routes Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', validUserData.email);
      expect(response.body).not.toHaveProperty('password');

      // Verify user was created in database
      const user = await User.findOne({ email: validUserData.email });
      expect(user).toBeTruthy();
      expect(user?.email).toBe(validUserData.email);
    });

    it('should return 409 for duplicate email', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(validUserData);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'User already exists');
    });

    it('should return 500 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Registration failed');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      email: 'login@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      // Register user before each login test
      await request(app).post('/api/auth/register').send(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: userData.password,
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for missing credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});

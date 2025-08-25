import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { login, register } from '../../controllers/AuthController';
import User from '../../models/UserModel';

jest.mock('../../models/UserModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockUser = User as jest.Mocked<typeof User>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
    });

    it('should register a new user successfully', async () => {
      mockUser.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockUser.create.mockResolvedValue({
        _id: 'userId123',
        email: 'test@example.com',
      } as any);

      await register(req as Request, res as Response);

      expect(mockUser.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        id: 'userId123',
        email: 'test@example.com',
      });
    });

    it('should return 409 if user already exists', async () => {
      mockUser.findOne.mockResolvedValue({ email: 'test@example.com' } as any);

      await register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should return 500 on database error', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'));

      await register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
    });

    it('should login successfully with valid credentials', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword',
      } as any);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue('mockToken' as never);

      await login(req as Request, res as Response);

      expect(mockUser.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword'
      );
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: 'userId123' },
        process.env.JWT_SECRET || 'defaultsecret',
        { expiresIn: '7d' }
      );
      expect(jsonMock).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return 401 if user not found', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is invalid', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword',
      } as any);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 500 on database error', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'));

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Login failed' });
    });
  });
});

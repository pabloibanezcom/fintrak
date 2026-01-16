import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/auth';

jest.mock('jsonwebtoken');

const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('authenticate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
  const VALID_USER_ID = 'user123';
  const VALID_TOKEN = 'valid.jwt.token';

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    next = jest.fn();

    req = {
      headers: {},
      user: undefined,
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('successful authentication', () => {
    it('should authenticate with valid Bearer token', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockReturnValue({ userId: VALID_USER_ID } as any);

      authenticate(req as Request, res as Response, next);

      expect(mockJwt.verify).toHaveBeenCalledWith(VALID_TOKEN, JWT_SECRET);
      expect(req.user).toEqual({ id: VALID_USER_ID });
      expect(next).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('should correctly decode and attach user data to request', () => {
      const userId = 'abc-123-def-456';
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockReturnValue({ userId } as any);

      authenticate(req as Request, res as Response, next);

      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(userId);
      expect(next).toHaveBeenCalled();
    });

    it('should handle token with extra whitespace after Bearer', () => {
      // Note: Due to split(' ')[1] implementation, extra spaces create empty token
      // This tests actual behavior - middleware returns 401 for empty token
      req.headers = {
        authorization: `Bearer  ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      authenticate(req as Request, res as Response, next);

      // With "Bearer  token", split(' ')[1] gives '', causing verification to fail
      expect(mockJwt.verify).toHaveBeenCalledWith('', JWT_SECRET);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('missing Authorization header', () => {
    it('should return 401 when Authorization header is missing', () => {
      req.headers = {};

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
      expect(mockJwt.verify).not.toHaveBeenCalled();
    });

    it('should return 401 when Authorization header is undefined', () => {
      req.headers = {
        authorization: undefined,
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid token format', () => {
    it('should return 401 when Bearer prefix is missing', () => {
      req.headers = {
        authorization: VALID_TOKEN,
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
      expect(mockJwt.verify).not.toHaveBeenCalled();
    });

    it('should return 401 when only "Bearer" is provided without token', () => {
      req.headers = {
        authorization: 'Bearer',
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
      expect(mockJwt.verify).not.toHaveBeenCalled();
    });

    it('should return 401 when Bearer is followed by empty string', () => {
      // Note: "Bearer " passes the startsWith check, so it tries to verify empty token
      req.headers = {
        authorization: 'Bearer ',
      };
      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      authenticate(req as Request, res as Response, next);

      // split(' ')[1] gives '' for "Bearer ", which is passed to verify
      expect(mockJwt.verify).toHaveBeenCalledWith('', JWT_SECRET);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for token with wrong prefix scheme', () => {
      req.headers = {
        authorization: `Basic ${VALID_TOKEN}`,
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('invalid JWT token', () => {
    it('should return 401 for malformed token', () => {
      req.headers = {
        authorization: 'Bearer malformed.token',
      };
      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should return 401 for expired token', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should return 401 for token signed with wrong secret', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockImplementation(() => {
        const error = new Error('invalid signature');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for token with invalid algorithm', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockImplementation(() => {
        const error = new Error('invalid algorithm');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle any JWT verification error gracefully', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Unexpected JWT error');
      });

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle lowercase "bearer" prefix', () => {
      req.headers = {
        authorization: `bearer ${VALID_TOKEN}`,
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle mixed case "BeArEr" prefix', () => {
      req.headers = {
        authorization: `BeArEr ${VALID_TOKEN}`,
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle authorization header with leading spaces', () => {
      req.headers = {
        authorization: `  Bearer ${VALID_TOKEN}`,
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle empty authorization header', () => {
      req.headers = {
        authorization: '',
      };

      authenticate(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should not call next() multiple times on success', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockReturnValue({ userId: VALID_USER_ID } as any);

      authenticate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should not modify response on successful authentication', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockReturnValue({ userId: VALID_USER_ID } as any);

      authenticate(req as Request, res as Response, next);

      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('token extraction', () => {
    it('should handle multiple spaces after Bearer (extracts empty string)', () => {
      // Note: This tests actual behavior - split(' ')[1] on multiple spaces gives ''
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      req.headers = {
        authorization: `Bearer   ${token}`,
      };
      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      authenticate(req as Request, res as Response, next);

      // With "Bearer   token", split(' ')[1] gives '', not the token
      expect(mockJwt.verify).toHaveBeenCalledWith('', JWT_SECRET);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle very long JWT tokens', () => {
      const longToken = 'a'.repeat(1000);
      req.headers = {
        authorization: `Bearer ${longToken}`,
      };
      mockJwt.verify.mockReturnValue({ userId: VALID_USER_ID } as any);

      authenticate(req as Request, res as Response, next);

      expect(mockJwt.verify).toHaveBeenCalledWith(longToken, JWT_SECRET);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('user object population', () => {
    it('should correctly map userId from token to req.user.id', () => {
      const testUserId = 'test-user-id-12345';
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockReturnValue({ userId: testUserId } as any);

      authenticate(req as Request, res as Response, next);

      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(testUserId);
      expect(Object.keys(req.user || {})).toEqual(['id']);
    });

    it('should not populate req.user on authentication failure', () => {
      req.headers = {
        authorization: `Bearer ${VALID_TOKEN}`,
      };
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticate(req as Request, res as Response, next);

      expect(req.user).toBeUndefined();
    });
  });
});

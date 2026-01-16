# Fintrak Test Examples & Templates

This document provides concrete examples and templates for writing tests for the priority gaps identified in the test coverage analysis.

---

## Table of Contents

1. [API Testing Examples](#api-testing-examples)
2. [Mobile Testing Examples](#mobile-testing-examples)
3. [Common Testing Patterns](#common-testing-patterns)
4. [Mock Examples](#mock-examples)

---

## API Testing Examples

### 1. Auth Middleware Tests

**File:** `apps/api/src/__tests__/middleware/auth.test.ts`

```typescript
import { authenticate } from '../../middleware/auth';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Valid Token', () => {
    it('should call next() with valid Bearer token', () => {
      const token = 'valid-token';
      req.headers!.authorization = `Bearer ${token}`;
      
      (jwt.verify as jest.Mock).mockReturnValue({
        userId: 'user-123',
      });

      authenticate(req as Request, res as Response, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        expect.any(String)
      );
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual({ id: 'user-123' });
    });
  });

  describe('Missing Token', () => {
    it('should return 401 when no Authorization header', () => {
      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing or invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when Authorization header missing Bearer prefix', () => {
      req.headers!.authorization = 'InvalidToken';

      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Token', () => {
    it('should return 401 with invalid/expired token', () => {
      req.headers!.authorization = 'Bearer invalid-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
```

### 2. S3 Service Tests

**File:** `apps/api/src/__tests__/services/s3Service.test.ts`

```typescript
import { uploadFile, deleteFile, MediaType } from '../../services/s3Service';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/lib-storage');
jest.mock('@aws-sdk/client-s3');

describe('S3Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_REGION = 'eu-west-1';
    process.env.S3_BUCKET_NAME = 'test-bucket';
  });

  describe('uploadFile', () => {
    it('should upload file with correct S3 path structure', async () => {
      const fileBuffer = Buffer.from('test content');
      const originalFileName = 'document.pdf';
      const userId = 'user-123';
      const mediaType: MediaType = 'document';

      // Mock Upload
      const mockUpload = {
        done: jest.fn().mockResolvedValue({}),
      };
      (Upload as jest.Mock).mockImplementation(() => mockUpload);

      const url = await uploadFile(fileBuffer, originalFileName, {
        userId,
        mediaType,
      });

      // Verify upload parameters
      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(S3Client),
        params: expect.objectContaining({
          Bucket: 'test-bucket',
          Key: expect.stringMatching(
            /^users\/user-123\/document\/.+\.pdf$/
          ),
          Body: fileBuffer,
          ContentType: 'application/pdf',
        }),
      });

      expect(url).toMatch(/^https:\/\/test-bucket\.s3\.eu-west-1/);
    });

    it('should handle content type detection', async () => {
      const fileBuffer = Buffer.from('image data');
      const mockUpload = {
        done: jest.fn().mockResolvedValue({}),
      };
      (Upload as jest.Mock).mockImplementation(() => mockUpload);

      await uploadFile(fileBuffer, 'image.png', {
        userId: 'user-123',
        mediaType: 'profile-picture',
      });

      expect(Upload).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            ContentType: 'image/png',
          }),
        })
      );
    });

    it('should throw error on upload failure', async () => {
      const mockUpload = {
        done: jest
          .fn()
          .mockRejectedValue(new Error('Upload failed')),
      };
      (Upload as jest.Mock).mockImplementation(() => mockUpload);

      await expect(
        uploadFile(Buffer.from('test'), 'file.pdf', {
          userId: 'user-123',
          mediaType: 'document',
        })
      ).rejects.toThrow('Failed to upload file to S3');
    });
  });

  describe('deleteFile', () => {
    it('should delete file from S3', async () => {
      const mockSend = jest.fn().mockResolvedValue({});
      (S3Client as jest.Mock).mockImplementation(() => ({
        send: mockSend,
      }));

      const fileUrl =
        'https://test-bucket.s3.eu-west-1.amazonaws.com/users/user-123/document/abc.pdf';
      await deleteFile(fileUrl);

      expect(mockSend).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand)
      );
    });
  });
});
```

### 3. BankController Tests (TinkService Integration)

**File:** `apps/api/src/__tests__/controllers/BankController.test.ts`

```typescript
import * as BankController from '../../controllers/BankController';
import TinkService from '../../services/TinkService';
import type { Request, Response } from 'express';

jest.mock('../../services/TinkService');

describe('BankController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      headers: {},
      query: {},
      body: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getProviders', () => {
    it('should fetch providers for specified market', async () => {
      const mockProviders = [
        {
          name: 'ica_bank_se',
          displayName: 'ICA Banken',
          isPopular: true,
        },
      ];

      (TinkService.getProviders as jest.Mock).mockResolvedValue(
        mockProviders
      );

      req.query = { market: 'SE' };

      await BankController.getProviders(
        req as Request,
        res as Response
      );

      expect(TinkService.getProviders).toHaveBeenCalledWith('SE');
      expect(res.json).toHaveBeenCalledWith(mockProviders);
    });

    it('should default to ES market when not specified', async () => {
      const mockProviders = [];
      (TinkService.getProviders as jest.Mock).mockResolvedValue(
        mockProviders
      );

      await BankController.getProviders(
        req as Request,
        res as Response
      );

      expect(TinkService.getProviders).toHaveBeenCalledWith('ES');
    });

    it('should handle service errors', async () => {
      (TinkService.getProviders as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      await BankController.getProviders(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Failed to fetch providers',
        })
      );
    });
  });

  describe('getAuthorizationUrl', () => {
    it('should generate authorization URL', async () => {
      const mockUrl = 'https://tink.example.com/authorize?state=abc123';
      (TinkService.getAuthorizationUrl as jest.Mock).mockReturnValue(
        mockUrl
      );

      req.body = { redirectUri: 'https://myapp.com/callback' };

      await BankController.getAuthorizationUrl(
        req as Request,
        res as Response
      );

      expect(TinkService.getAuthorizationUrl).toHaveBeenCalledWith(
        'https://myapp.com/callback',
        undefined
      );
      expect(res.json).toHaveBeenCalledWith({
        authorizationUrl: mockUrl,
      });
    });

    it('should return 400 when redirectUri missing', async () => {
      req.body = {};

      await BankController.getAuthorizationUrl(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Missing required field',
        })
      );
    });
  });
});
```

### 4. Query Utils Tests

**File:** `apps/api/src/__tests__/utils/queryUtils.test.ts`

```typescript
import {
  parsePaginationParams,
  parseSortParams,
  buildDateRangeQuery,
  buildAmountRangeQuery,
} from '../../utils/queryUtils';
import type { Request } from 'express';

describe('Query Utilities', () => {
  describe('parsePaginationParams', () => {
    it('should parse limit and offset from query', () => {
      const req = { query: { limit: '25', offset: '50' } } as any;

      const result = parsePaginationParams(req);

      expect(result).toEqual({ limit: 25, offset: 50 });
    });

    it('should use default values when not provided', () => {
      const req = { query: {} } as any;

      const result = parsePaginationParams(req);

      expect(result).toEqual({ limit: 50, offset: 0 });
    });
  });

  describe('buildDateRangeQuery', () => {
    it('should create $gte and $lte for date range', () => {
      const query = buildDateRangeQuery('2024-01-01', '2024-12-31');

      expect(query).toEqual({
        $gte: new Date('2024-01-01'),
        $lte: new Date('2024-12-31'),
      });
    });

    it('should return undefined when no dates provided', () => {
      const query = buildDateRangeQuery();

      expect(query).toBeUndefined();
    });

    it('should handle only dateFrom', () => {
      const query = buildDateRangeQuery('2024-01-01');

      expect(query).toEqual({
        $gte: new Date('2024-01-01'),
      });
    });
  });

  describe('buildAmountRangeQuery', () => {
    it('should create range query for amount', () => {
      const query = buildAmountRangeQuery('10', '100');

      expect(query).toEqual({
        $gte: 10,
        $lte: 100,
      });
    });

    it('should handle string to number conversion', () => {
      const query = buildAmountRangeQuery('50.50', '99.99');

      expect(query).toEqual({
        $gte: 50.5,
        $lte: 99.99,
      });
    });
  });
});
```

---

## Mobile Testing Examples

### 1. UserContext Tests

**File:** `apps/mobile/context/__tests__/UserContext.test.tsx`

```typescript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { UserProvider, useUser } from '../UserContext';
import { apiService } from '../../services/api';

jest.mock('../../services/api');

const TestComponent = () => {
  const { user, loading, error, fetchUser } = useUser();

  return (
    <>
      {loading && <Text>Loading</Text>}
      {error && <Text>Error: {error}</Text>}
      {user && (
        <>
          <Text>User: {user.name}</Text>
          <Text>Email: {user.email}</Text>
        </>
      )}
    </>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide user context', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      lastName: 'User',
      authProvider: 'email' as const,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    (apiService.getCurrentUser as jest.Mock).mockResolvedValue(
      mockUser
    );

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Component renders without error
    expect(screen.getByText(/User Context/)).toBeTruthy();
  });

  it('should fetch user on demand', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      lastName: 'User',
      authProvider: 'email' as const,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    (apiService.getCurrentUser as jest.Mock).mockResolvedValue(
      mockUser
    );

    let fetchUserFn: () => void = () => {};

    const FetchComponent = () => {
      const { fetchUser } = useUser();
      fetchUserFn = fetchUser;
      return null;
    };

    render(
      <UserProvider>
        <FetchComponent />
      </UserProvider>
    );

    await waitFor(() => {
      fetchUserFn();
    });

    expect(apiService.getCurrentUser).toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    (apiService.getCurrentUser as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    let fetchUserFn: () => void = () => {};
    let errorValue = '';

    const FetchComponent = () => {
      const { fetchUser, error } = useUser();
      fetchUserFn = fetchUser;
      errorValue = error || '';
      return null;
    };

    render(
      <UserProvider>
        <FetchComponent />
      </UserProvider>
    );

    await waitFor(async () => {
      await fetchUserFn();
      expect(errorValue).toBeTruthy();
    });
  });

  it('should clear user data', () => {
    let clearUserFn: () => void = () => {};
    let userValue = { id: 'test' };

    const TestComp = () => {
      const { clearUser, user } = useUser();
      clearUserFn = clearUser;
      userValue = user;
      return null;
    };

    render(
      <UserProvider>
        <TestComp />
      </UserProvider>
    );

    act(() => {
      clearUserFn();
    });

    expect(userValue).toBeNull();
  });
});
```

### 2. AuthStorage Tests

**File:** `apps/mobile/utils/__tests__/authStorage.test.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthStorage from '../authStorage';

jest.mock('@react-native-async-storage/async-storage');

describe('AuthStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveToken', () => {
    it('should save token to AsyncStorage', async () => {
      const token = 'test-token-123';

      await AuthStorage.saveToken(token);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        token
      );
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(
        AuthStorage.saveToken('token')
      ).rejects.toThrow('Storage error');
    });
  });

  describe('getToken', () => {
    it('should retrieve token from AsyncStorage', async () => {
      const token = 'stored-token';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(token);

      const result = await AuthStorage.getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        'auth_token'
      );
      expect(result).toBe(token);
    });

    it('should return null when token not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await AuthStorage.getToken();

      expect(result).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('should remove token from AsyncStorage', async () => {
      await AuthStorage.clearToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'auth_token'
      );
    });
  });
});
```

### 3. Mobile API Service Expansion

**File:** `apps/mobile/services/__tests__/api.test.ts` (Extended)

```typescript
describe('ApiService - Extended Coverage', () => {
  describe('getAnalytics', () => {
    it('should fetch analytics data with date range', async () => {
      const mockAnalytics = {
        period: {
          from: '2024-01-01',
          to: '2024-12-31',
          currency: 'EUR',
        },
        expenses: {
          total: 5000,
          byCategory: [],
        },
        incomes: {
          total: 8000,
          byCategory: [],
        },
        balance: 3000,
        latestTransactions: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalytics),
      });

      const result = await apiService.getAnalytics(
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/analytics/period-summary?dateFrom=2024-01-01&dateTo=2024-12-31',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockAnalytics);
    });
  });

  describe('getCounterparties', () => {
    it('should fetch list of counterparties', async () => {
      const mockCounterparties = [
        { id: '1', name: 'Supplier A', type: 'vendor' },
        { id: '2', name: 'Customer B', type: 'customer' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCounterparties),
      });

      const result = await apiService.getCounterparties();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/counterparties',
        expect.any(Object)
      );
      expect(result).toEqual(mockCounterparties);
    });
  });

  describe('createExpense', () => {
    it('should create new expense', async () => {
      const expenseData = {
        amount: 100,
        category: 'food',
        description: 'Lunch',
        date: '2024-01-15',
      };

      const mockResponse = { id: 'exp-123', ...expenseData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.createExpense(expenseData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/expenses',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(expenseData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Authentication Headers', () => {
    it('should include Authorization header when token is set', async () => {
      const token = 'test-token-xyz';
      apiService.setToken(token);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiService.getExpenses();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        })
      );
    });

    it('should not include Authorization header when token is null', async () => {
      apiService.setToken(null);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiService.getExpenses();

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });
});
```

---

## Common Testing Patterns

### Pattern 1: Testing Error Handling in Controllers

```typescript
// Generic error handler test pattern
describe('Controller Error Handling', () => {
  it('should return 400 for validation errors', async () => {
    req.body = { /* invalid data */ };

    await controller.create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('validation'),
      })
    );
  });

  it('should return 401 for authentication errors', async () => {
    req.user = undefined;

    await controller.create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 500 for database errors', async () => {
    (Model.create as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await controller.create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
```

### Pattern 2: Testing Service Integration

```typescript
// Service test pattern with dependency injection
describe('Service Integration Tests', () => {
  let service: MyService;
  let mockDependency: jest.Mocked<IDependency>;

  beforeEach(() => {
    mockDependency = createMockDependency();
    service = new MyService(mockDependency);
  });

  it('should handle service chain calls', async () => {
    mockDependency.getData.mockResolvedValue(testData);

    const result = await service.process('input');

    expect(mockDependency.getData).toHaveBeenCalledWith('input');
    expect(result).toEqual(expectedOutput);
  });

  it('should handle service failures gracefully', async () => {
    mockDependency.getData.mockRejectedValue(
      new Error('Service down')
    );

    await expect(service.process('input')).rejects.toThrow(
      'Service down'
    );
  });
});
```

### Pattern 3: Testing Async Flows in React

```typescript
// React async testing pattern
describe('Async Component Behavior', () => {
  it('should show loading state during fetch', async () => {
    (apiService.fetchData as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockData), 100)
        )
    );

    render(<MyComponent />);

    expect(screen.getByText('Loading')).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByText('Loading')).toBeNull();
    });
  });
});
```

---

## Mock Examples

### Mock Factory Pattern

```typescript
// factories/mockUserFactory.ts
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  lastName: 'User',
  authProvider: 'email' as const,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  ...overrides,
});

// In tests:
const customUser = createMockUser({
  email: 'custom@example.com',
  name: 'Custom',
});
```

### Mocking External Services

```typescript
// __mocks__/services/S3Service.ts
export const uploadFile = jest.fn();
export const deleteFile = jest.fn();

// In tests:
import * as s3Service from '../../services/s3Service';
jest.mock('../../services/s3Service');

(s3Service.uploadFile as jest.Mock).mockResolvedValue(
  'https://s3.example.com/file.pdf'
);
```

---

## Quick Reference

### Running Tests

```bash
# API tests
pnpm --filter @fintrak/api test
pnpm --filter @fintrak/api test --coverage

# Mobile tests
pnpm --filter @fintrak/mobile test
pnpm --filter @fintrak/mobile test --coverage

# All tests
pnpm test
```

### Coverage Reports

```bash
# Generate coverage reports
pnpm --filter @fintrak/api test --coverage

# View coverage in browser (if configured)
open apps/api/coverage/lcov-report/index.html
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)


import type { Request, Response } from 'express';
import { getUserId, requireAuth } from '../../utils/authUtils';

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
} & Partial<Response>;

function createMockResponse(): MockResponse {
  const res: MockResponse = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe('authUtils', () => {
  it('returns user id from request when present', () => {
    const reqWithUser = { user: { id: 'user-123' } } as Request;
    expect(getUserId(reqWithUser)).toBe('user-123');
  });

  it('returns null when user is missing', () => {
    const reqWithoutUser = {} as Request;
    expect(getUserId(reqWithoutUser)).toBeNull();
  });

  it('requireAuth returns user id and does not send error for authenticated request', () => {
    const req = { user: { id: 'user-456' } } as Request;
    const res = createMockResponse();

    const userId = requireAuth(req, res as Response);

    expect(userId).toBe('user-456');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('requireAuth sends 401 and returns null for unauthenticated request', () => {
    const req = {} as Request;
    const res = createMockResponse();

    const userId = requireAuth(req, res as Response);

    expect(userId).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
  });
});

import type { Response } from 'express';
import {
  handleAuthError,
  handleGenericError,
  handleNotFoundError,
  handleValidationError,
} from '../../utils/errorUtils';

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

describe('errorUtils', () => {
  it('handles auth and not found errors', () => {
    const res = createMockResponse();

    handleAuthError(res as Response);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });

    handleNotFoundError(res as Response, 'Category');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
  });

  it('handles validation error with details', () => {
    const res = createMockResponse();
    const validationError = new Error('name is required');
    validationError.name = 'ValidationError';

    handleValidationError(res as Response, validationError, 'category');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: 'name is required',
    });
  });

  it('handles non-validation errors with resource and default request label', () => {
    const res = createMockResponse();

    handleValidationError(res as Response, new Error('boom'), 'category');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to process category',
    });

    handleValidationError(res as Response, new Error('boom'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to process request',
    });
  });

  it('handles generic error without logging in test env', () => {
    const res = createMockResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // suppress expected log in test
    });

    handleGenericError(res as Response, 'update category', new Error('db error'));

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to update category',
    });

    consoleSpy.mockRestore();
  });
});

import type { Request, Response } from 'express';
import { importRecurringTransactions } from '../../controllers/ImportController';

// Simple integration test that just verifies the function doesn't crash
describe('ImportController - importRecurringTransactions', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    req = {
      user: { id: 'userId123' },
      file: {
        buffer: Buffer.from(
          JSON.stringify([
            {
              title: 'Monthly Mortgage',
              currency: 'EUR',
              category: 'housing',
              transactionType: 'EXPENSE',
              minAproxAmount: 1000,
              maxAproxAmount: 1100,
              periodicity: 'MONTHLY',
            },
          ])
        ),
        mimetype: 'application/json',
        originalname: 'recurring-transactions.json',
      } as Express.Multer.File,
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  it('should return 400 if no file uploaded', async () => {
    req.file = undefined;

    await importRecurringTransactions(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'No file uploaded',
    });
  });

  it('should return 401 if user not authenticated', async () => {
    req.user = undefined;

    await importRecurringTransactions(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'User not authenticated',
    });
  });

  it('should handle invalid JSON', async () => {
    if (req.file) {
      req.file.buffer = Buffer.from('invalid json');
    }

    await importRecurringTransactions(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('Invalid JSON file'),
      })
    );
  });

  it('should handle empty array', async () => {
    if (req.file) {
      req.file.buffer = Buffer.from(JSON.stringify([]));
    }

    await importRecurringTransactions(req as Request, res as Response);

    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 0,
        imported: 0,
      })
    );
  });
});

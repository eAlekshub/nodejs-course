import { Request, Response } from 'express';
import { HttpError } from '../../src/errors/httpError';
import { errorHandler } from '../../src/errors/errorHandler';

const req: Request = {} as Request;
const res: Response = {
  status: jest.fn(() => res),
  json: jest.fn(),
} as unknown as Response;
const next: jest.Mock = jest.fn();

describe('errorHandler', () => {
  it('should handle HttpError and return the correct response', () => {
    const error: HttpError = new HttpError('Not found', 404);
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle non-HttpError and return a 500 error response', () => {
    const error: Error = new Error('Internal Server Error');
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(next).not.toHaveBeenCalled();
  });
});

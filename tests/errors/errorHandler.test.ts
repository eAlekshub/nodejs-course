import { Request, Response } from 'express';
import { HttpError } from '../../src/errors/httpError';
import { errorHandler } from '../../src/errors/errorHandler';
import { apiErrors } from '../../src/constants';

const req: Request = {} as Request;
const res: Response = {
  status: jest.fn(() => res),
  json: jest.fn(),
} as unknown as Response;
const next: jest.Mock = jest.fn();

describe('errorHandler', () => {
  it('should handle HttpError and return the correct response', () => {
    const error: HttpError = new HttpError(apiErrors.NOT_FOUND, 404);
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: apiErrors.NOT_FOUND });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle non-HttpError and return a 500 error response', () => {
    const error: Error = new Error(apiErrors.SERVER_ERROR);
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: apiErrors.SERVER_ERROR });
    expect(next).not.toHaveBeenCalled();
  });
});

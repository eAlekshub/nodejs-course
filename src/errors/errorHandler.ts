import { NextFunction, Request, Response } from 'express';
import { HttpError } from './httpError';
import { apiErrors } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof HttpError) {
    res.status(error.code).json({ error: error.message });
  } else {
    res.status(500).json({ error: apiErrors.SERVER_ERROR });
  }
};

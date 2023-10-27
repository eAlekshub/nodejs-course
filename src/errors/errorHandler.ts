import { NextFunction, Request, Response } from 'express';
import { HttpError } from './httpError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(error);
  if (error instanceof HttpError) {
    res.status(error.code).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

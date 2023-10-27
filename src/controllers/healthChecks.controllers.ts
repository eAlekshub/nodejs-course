import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response): void => {
  const response: { status: string } = { status: 'Server is up and running' };
  res.status(200).json(response);
};

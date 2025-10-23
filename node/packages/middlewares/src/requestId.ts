import { Request, Response, NextFunction } from 'express';

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.id = "---"
  next();
};

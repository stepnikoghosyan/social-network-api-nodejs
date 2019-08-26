import { Request, Response, NextFunction } from 'express';
import errorHandler from '../shared/errorHandler';

export default function(req: Request, res: Response, next: NextFunction): void {
  if (req.files && req.files.image) {
    next();
    return;
  }

  errorHandler(res, {
    statusCode: 400,
    errorMessage: 'Image file is required'
  });
}

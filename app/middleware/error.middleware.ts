import { Request, Response, NextFunction } from 'express';
import errorHandler from '../shared/errorHandler';

export default function(err: any, req: Request, res: Response, next: NextFunction): void {
  errorHandler(res, {
    statusCode: err.status || 500,
    errorMessage: err.message || 'Internal server error. Something failed.',
    // error: err
  });
}

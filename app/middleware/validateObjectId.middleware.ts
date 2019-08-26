import { Request, Response, NextFunction } from 'express';
import {Types} from 'mongoose';
import errorHandler from '../shared/errorHandler';

export default function(req: Request, res: Response, next: NextFunction): void {
  if (Types.ObjectId.isValid(req.params.id)) {
    next();
    return;
  }

  errorHandler(res, {
    statusCode: 400,
    errorMessage: 'Invalid id.'
  });
}

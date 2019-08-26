import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import errorHandler from '../shared/errorHandler';
import config from '../config/config';

export default function (req: Request, res: Response, next: NextFunction): void {
  const token = req.header('Authorization');

  if (!token) {
    return errorHandler(res, {
      statusCode: 401,
      errorMessage: 'Forbidden. No token provided.'
    });
  }

  const decoded = verify(token, config.get('jwtPrivateKey'));
  if (!decoded) {
    return errorHandler(res, {
      statusCode: 403,
      errorMessage: 'Access denied.'
    });
  }

  req.user = decoded;
  next();
}

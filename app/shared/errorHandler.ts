import { Response } from 'express';
import { IErrorResponse, IFormErrorResponse } from './interfaces/error-response.model';

export default function errorHandler<T>(res: Response, error: IErrorResponse | IFormErrorResponse): void {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  if (!error.errorMessage) {
    error.errorMessage = 'Something failed...';
  }

  res
    .status(error.statusCode)
    .send(error);
}

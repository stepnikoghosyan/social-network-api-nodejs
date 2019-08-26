import { Response } from 'express';
import { IPaginationResponse } from './interfaces/pagination.model';

export function successHandler<T>(res: Response, data: T | IPaginationResponse<T>, status: number): void {
  res
    .status(status)
    .send({
      statusCode: status,
      data
    });
}

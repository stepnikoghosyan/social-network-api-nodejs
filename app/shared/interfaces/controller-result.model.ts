import { IErrorResponse, IFormErrorResponse } from './error-response.model';

export interface IControllerResult<T> {
  error: IErrorResponse | IFormErrorResponse | null;
  data: T | T[] | null;
}

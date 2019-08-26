export interface IErrorResponse {
  statusCode: number;
  errorMessage: string;
}

export interface IFormErrorResponse extends IErrorResponse {
  field: string;
}

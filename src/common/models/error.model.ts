export class ErrorModel {
  message: string;
  field: string;
}

export class OutputModelErrors {
  errorsMessages: ErrorModel[];
}



export class InvalidParamError extends Error {
  constructor(message: string) {
    super(`Invalid Param: ${message}`);
    this.name = "Invalid Param Error";
  }
}
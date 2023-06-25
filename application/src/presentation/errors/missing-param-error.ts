

export default class MissingParamError extends Error {
  constructor(message: string) {
    super(`Missing Param: ${message}`);
  }
}
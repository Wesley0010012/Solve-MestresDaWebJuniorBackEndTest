import { ListFilmsController } from "../../../src/presentation/controllers/list-films-controller/list-films-controller"
import { InvalidParamError, MissingParamError } from "../../../src/presentation/errors"
import { HttpRequest, HttpResponse } from "../../../src/presentation/protocols"

interface SutTypes {
  sut: ListFilmsController
}

const makeSut = (): SutTypes => {
  const sut = new ListFilmsController;

  return {
    sut
  };
}

describe('ListFilmsController', () => {
  test('Test Should return 400 if no token was provided', async () => {
    const error = new MissingParamError('token');

    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        order: false
      }
    }

    const response: HttpResponse = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
  });
});
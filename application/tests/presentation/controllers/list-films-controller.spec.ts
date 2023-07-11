import { Decrypter } from "../../../src/data"
import { ListFilmsController } from "../../../src/presentation/controllers/list-films-controller/list-films-controller"
import { AccessDeniedError, InvalidParamError, MissingParamError } from "../../../src/presentation/errors"
import { serverError } from "../../../src/presentation/helpers"
import { HttpRequest, HttpResponse } from "../../../src/presentation/protocols"

const makeJWT = (): Decrypter => {
  class JWT implements Decrypter {
    constructor(private readonly secret: string){}

    decrypt(cyphertext: string): Promise<string> {
      return Promise.resolve("any_value");
    }
  }

  return new JWT('secret');
}

interface SutTypes {
  sut: ListFilmsController,
  JWT: Decrypter
}

const makeSut = (): SutTypes => {
  const JWT = makeJWT();
  const sut = new ListFilmsController(JWT);

  return {
    sut,
    JWT
  };
}

describe('ListFilmsController', () => {
  test('Should return 400 if no token was provided', async () => {
    const error = new MissingParamError('token');

    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        order: 'any'
      }
    }

    const response: HttpResponse = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should return 400 if no order was provided', async() => {
    const error = new MissingParamError('order');

    const { sut } = makeSut();

    const request: HttpRequest = {
      body: {
        token: 'any_token'
      }
    }

    const response: HttpResponse = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should return 401 if JWT throws', async () => {
    const error = new AccessDeniedError();

    const { sut, JWT } = makeSut();

    jest.spyOn(JWT, 'decrypt').mockImplementationOnce((): Promise<string> => {
      throw new Error();
    });

    const request: HttpRequest = {
      body: {
        token: 'false_token',
        order: 'any'
      }
    }

    const response: HttpResponse = await sut.handle(request);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(error.message);
  });
});
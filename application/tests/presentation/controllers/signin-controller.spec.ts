/*
  SignInController Full Test Sequence.
  Objective: test all possible cases and states for the given Controller.
  Test Sequence:
  -> Should Return 400 if no email is provided.
  -> Should Return 400 if no password is provided.
  -> Should return 400 if invalid email is provided.
  -> Should call EmailValidator with the correct Email.
  -> Should return 500 if Authentication Throws.
  -> Should return 500 if EmailValidator throws.
  -> Should return 401 if Authenticate with incorrect login.
  -> Should Authentication have been called with correct login.
  -> Should return 200 if logged.

  Test Deferred by: Wesley Laurindo.
*/

import { Authentication } from "../../../src/domain/usecases";
import SigninController from "../../../src/presentation/controllers/signin-controller/signin-controller";
import { InternalServerError, MissingParamError, InvalidParamError, AccessDeniedError } from "../../../src/presentation/errors/";
import { EmailValidator } from "../../../src/validation/protocols/";
import { HttpRequest, HttpResponse } from "../../../src/presentation/protocols/";

import faker from 'faker';

const mockRequest = (): object => ({
  email: faker.internet.email,
  password: faker.internet.password
});

function makeEmailValidator(): EmailValidator {
  class emailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new emailValidatorStub;
}

function makeAuthentication(): Authentication {
  class AuthenticationStub implements Authentication {
    auth(authParams: Authentication.Params): Authentication.Result|false {
      return {
        accessToken: "ok",
        name: "Ok"
      };
    }
  }

  return new AuthenticationStub;
}

interface SutTypes {
  sut: SigninController,
  emailValidatorStub: EmailValidator,
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new SigninController(emailValidatorStub, authenticationStub);

  return {
    sut, emailValidatorStub, authenticationStub
  }
}


describe('SignInController Tests', () => {
  test('Should Return 400 if no email is provided.', async () => {
    const { sut } = makeSut();

    const error = new MissingParamError('email');

    const request: HttpRequest = {
      body: {
        email: "",
        password: "any_password"
      }
    }

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toEqual(error.message);
  });

  test('Should Return 400 if no password is provided.', async () => {
    const { sut } = makeSut();

    const error = new MissingParamError('password');

    const request: HttpRequest = {
      body: {
        email: "any_email",
        password: ""
      }
    }

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should return 400 if invalid email is provided.', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false);

    const error = new InvalidParamError('email');

    const request: HttpRequest = {
      body: mockRequest()
    }

    const response: HttpResponse = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should call EmailValidator with the correct Email.', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const request: HttpRequest = {
      body: mockRequest()
    }

    await sut.handle(request);

    expect(isValidSpy).toBeCalledWith(request.body.email);
  });

  test('Should return 500 if Authentication Throws.', async () => {
    const {sut, authenticationStub} = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new InternalServerError
    });

    const error = new InternalServerError;

    const request: HttpRequest = {
      body: mockRequest()
    }

    const result = await sut.handle(request);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(error);
    expect(result.body.message).toBe(error.message);
  });

  test('Should return 500 if EmailValidator throws.', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new InternalServerError;
    });

    const error = new InternalServerError;

    const request: HttpRequest = {
      body: mockRequest()
    };

    const result = await sut.handle(request);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(error);
    expect(result.body.message).toBe(error.message);
  });

  test('Should return 401 if Authenticate with incorrect login.', async () => {
    const {sut, authenticationStub} = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      return false;
    });

    const error = new AccessDeniedError;

    const request: HttpRequest = {
      body: mockRequest()
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should Authentication have been called with correct login.', async () => {
    const {sut, authenticationStub} = makeSut();

    const authenticationSpy = jest.spyOn(authenticationStub, 'auth');

    const error = new AccessDeniedError;

    const request: HttpRequest = {
      body: mockRequest()
    };

    await sut.handle(request);

    expect(authenticationSpy).toBeCalledWith({email: request.body.email, password: request.body.password});
  });

  test('Should return 200 if logged.', async () => {
    const { sut } = makeSut();

    const expectedResponse: Authentication.Result = {
      accessToken: "ok",
      name: "Ok"
    }

    const request: HttpRequest = {
      body: mockRequest()
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBe(expectedResponse.accessToken);
    expect(response.body.name).toBe(expectedResponse.name);
  });
});
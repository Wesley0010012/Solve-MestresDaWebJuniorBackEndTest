
import { Authentication } from "../../../domain/usecases/authentication";
import SigninController from "../../../presentation/controllers/signin-controller/signin-controller";
import InternalServerError from "../../../presentation/errors/internal-server-error";
import InvalidParamError from "../../../presentation/errors/invalid-param-error";
import MissingParamError from "../../../presentation/errors/missing-param-error";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";

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
    auth(authParams: Authentication.Params): Authentication.Result {
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
  test('Should Return 400 if no email is provided.', () => {
    const { sut } = makeSut();

    const error = new MissingParamError('email');

    const request: HttpRequest = {
      body: {
        email: "",
        password: "any_password"
      }
    }

    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toEqual(error.message);
  });

  test('Should Return 400 if no password is provided.', () => {
    const { sut } = makeSut();

    const error = new MissingParamError('password');

    const request: HttpRequest = {
      body: {
        email: "any_email",
        password: ""
      }
    }

    const response = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should return 400 if invalid email is provided.', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false);

    const error = new InvalidParamError('email');

    const request: HttpRequest = {
      body: mockRequest()
    }

    const response: HttpResponse = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });

  test('Should call EmailValidator with the correct Email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const request: HttpRequest = {
      body: mockRequest()
    }

    sut.handle(request);

    expect(isValidSpy).toBeCalledWith(request.body.email);
  });

  test('Should return 500 if Authentication Throws', () => {
    const {sut, authenticationStub} = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new InternalServerError
    });

    const error = new InternalServerError;

    const request: HttpRequest = {
      body: mockRequest()
    }

    const result = sut.handle(request);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(error);
    expect(result.body.message).toBe(error.message);
  });
});
import { response } from "express";
import SigninController from "../../../presentation/controllers/signin-controller/signin-controller";
import InvalidParamError from "../../../presentation/errors/invalid-param-error";
import MissingParamError from "../../../presentation/errors/missing-param-error";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";

const makeEmailValidator = (): EmailValidator => {
  class emailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new emailValidatorStub;
}

interface SutTypes {
  sut: SigninController,
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SigninController(emailValidatorStub);

  return {
    sut, emailValidatorStub
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
      body: {
        email: 'fake_email',
        password: 'fake_password'
      }
    }

    const response: HttpResponse = sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error);
    expect(response.body.message).toBe(error.message);
  });
});
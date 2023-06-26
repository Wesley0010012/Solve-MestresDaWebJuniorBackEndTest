import { EmailValidatorAdapter } from "../../../src/infra/validators/email-validator-adapter";
import { EmailValidator } from "../../../src/validation/protocols";

import faker from 'faker';


interface SutTypes {
  sut: EmailValidator,
}

const mockRequest = () => {
  return {
    email: faker.internet.email()
  };
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter;

  return {
    sut
  };
}

describe('EmailValidatorAdapter Tests', () => {
  test('Should return false if empty email was provided', () => {
    const { sut } = makeSut();

    const result = sut.isValid('');

    expect(result).toBe(false);
  });

  test('Should return false if invalid email was provided', () => {
    const { sut } = makeSut();

    const result = sut.isValid('any_invalid_email');

    expect(result).toBe(false);
  });

  test('Should EmailValidatorAdapter have been called with the correct Email', () => {
    const { sut } = makeSut();

    const sutSpy = jest.spyOn(sut, 'isValid');

    const data = mockRequest();

    sut.isValid(data.email);

    expect(sutSpy).toBeCalledWith(data.email);
  });

  test('Should return true if valid email was provided', () => {
    const { sut } = makeSut();

    const data = mockRequest();

    const result = sut.isValid(data.email);

    expect(result).toBe(true);
  });
});
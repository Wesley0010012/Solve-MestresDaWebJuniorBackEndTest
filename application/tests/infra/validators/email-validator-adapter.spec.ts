import { EmailValidatorAdapter } from "../../../src/infra/validators/email-validator-adapter";
import { EmailValidator } from "../../../src/validation/protocols";

import faker from 'faker';


interface SutTypes {
  sut: EmailValidator,
}

const mockRequest = () => {
  return {
    email: faker.internet.email
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
});
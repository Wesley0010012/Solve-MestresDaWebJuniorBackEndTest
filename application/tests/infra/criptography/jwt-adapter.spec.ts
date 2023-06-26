

import jwt from 'jsonwebtoken';
import { JWTAdapter } from '../../../src/infra/criptography/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },

  async encrypt(): Promise<string> {
    return 'any_value';
  }
}));

interface SutTypes {
  sut: JWTAdapter;
}

const makeSut = (): SutTypes => {
  const sut = new JWTAdapter('secret');

  return {
    sut
  };
}

describe('JWTAdapter tests', () => {
  test('Should Called Encrypt Sign with Correct Values', async () => {
    const { sut } = makeSut();

    const jwtSignSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_value');

    expect(jwtSignSpy).toBeCalledWith({id: 'any_value'}, 'secret');
  });

  test('Should return Cyphered Text', async() => {
    const { sut } = makeSut();

    const result = await sut.encrypt('any_value');

    expect(result).toBe('any_token');
  })
})
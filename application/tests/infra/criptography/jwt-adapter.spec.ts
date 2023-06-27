

import jwt from 'jsonwebtoken';
import { JWTAdapter } from '../../../src/infra/criptography/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },

  async verify(): Promise<string> {
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

  test('Should return the Cyphered Text', async() => {
    const { sut } = makeSut();

    const result = await sut.encrypt('any_value');

    expect(result).toBe('any_token');
  });

  test('Should throw if jwt-sign throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error('test');
    });

    const promise = sut.encrypt('any_value');

    await expect(promise).rejects.toThrow();
  });

  test('Should Called Decrypt Sign with Correct Values', async () => {
    const { sut } = makeSut();

    const jwtEncryptSpy = jest.spyOn(jwt, 'verify');

    await sut.decrypt('any_token');

    expect(jwtEncryptSpy).toBeCalledWith('any_token', 'secret');
  });

  test('Should return the PlainText', async () => {
    const { sut } = makeSut();

    const result = await sut.decrypt('any_token');

    expect(result).toBe('any_value');
  });
})
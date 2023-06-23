import SigninController from "./signin-controller";

describe('SignInController Tests', () => {
  test('Should Return 400 if no email is provided.', () => {
    const sut = new SigninController;

    const response = sut.handle();

    expect(response.statusCode).toBe(400);
  });
});
import SigninController from "../../../presentation/controllers/signin-controller/signin-controller";
import InvalidParamError from "../../../presentation/errors/invalid-param-error";
import { HttpRequest } from "../../../presentation/protocols/http";

describe('SignInController Tests', () => {
  test('Should Return 400 if no email is provided.', () => {
    const sut = new SigninController;

    const error = new InvalidParamError('email');

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
});
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { badRequest, success } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";


export default class SigninController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {
  }

  handle(request: HttpRequest): HttpResponse {
    const inputs = ['email', 'password'];

    for(const input of inputs) {
      if(!request.body[input])
        return badRequest(new MissingParamError(input));
    }

    const { email, password } = request.body;

    if(!this.emailValidator.isValid(email))
      return badRequest(new InvalidParamError('email'));

    return success('all ok');
  }
}
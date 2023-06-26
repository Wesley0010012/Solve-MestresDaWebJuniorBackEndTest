import { Authentication } from "../../../domain/usecases/";
import { AccessDeniedError, InternalServerError, InvalidParamError, MissingParamError } from '../../errors/';
import { badRequest, serverError, success, unauthorized } from "../../helpers/";
import { EmailValidator } from "../../../validation/protocols/";
import { Controller, HttpRequest, HttpResponse } from "../../protocols/";


export default class SigninController implements Controller {
  constructor(private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) {
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const inputs = ['email', 'password'];

      for(const input of inputs) {
        if(!request.body[input])
          return badRequest(new MissingParamError(input));
      }

      const { email, password } = request.body;

      if(!this.emailValidator.isValid(email))
        return badRequest(new InvalidParamError('email'));

      const result = this.authentication.auth({email: email, password: password});

      if(!result)
        return unauthorized(new AccessDeniedError);
      else
        return success(result);
    } catch(e: any) {
      return serverError(new InternalServerError);
    }
  }
}
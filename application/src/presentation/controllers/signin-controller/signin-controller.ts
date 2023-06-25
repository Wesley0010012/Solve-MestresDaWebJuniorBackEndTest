import { Authentication } from "../../../domain/usecases/authentication";
import AccessDeniedError from "../../errors/access-denied-error";
import InternalServerError from "../../errors/internal-server-error";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { badRequest, serverError, success, unauthorized } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { EmailValidator } from "../../../validation/protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";


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

      if(!this.authentication.auth({email: email, password: password}))
        return unauthorized(new AccessDeniedError);
      else
        return success("OK");
    } catch(e: any) {
      return serverError(new InternalServerError);
    }
  }
}
import InvalidParamError from "../../errors/invalid-param-error";
import { badRequest } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";


export default class SigninController implements Controller {
  handle(request: HttpRequest): HttpResponse {
    if(!request.body.email)
      return badRequest(new InvalidParamError('email'));

    return {
      statusCode: 200,
      body: 'Test Passed'
    };
  }
}
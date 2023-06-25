import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { badRequest } from "../../helpers/http-helpers";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";


export default class SigninController implements Controller {
  handle(request: HttpRequest): HttpResponse {
    const inputs = ['email', 'password'];

    for(const input of inputs) {
      if(!request.body[input])
        return badRequest(new MissingParamError(input));
    }



    return {
      statusCode: 200,
      body: 'Test Passed'
    };
  }
}
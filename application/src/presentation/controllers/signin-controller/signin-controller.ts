import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";


export default class SigninController implements Controller {
  handle(request: HttpRequest): HttpResponse {
    if(!request.body.email)
      return {
      statusCode: 400,
      body: 'Invalid email is provided'
    };

    return {
      statusCode: 200,
      body: 'Test Passed'
    };
  }
}
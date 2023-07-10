import { MissingParamError } from "../../errors";
import { badRequest, success } from "../../helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";


export class ListFilmsController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const inputs = ['token', 'order'];

    for(const input of inputs) {
      if(!request.body[input])
        return badRequest(new MissingParamError(input));
    }

    return success("Passed Everything");
  }
}
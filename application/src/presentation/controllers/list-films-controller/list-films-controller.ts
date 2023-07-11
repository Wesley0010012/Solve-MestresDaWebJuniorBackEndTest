
import { Decrypter } from "../../../data";
import { AccessDeniedError, MissingParamError } from "../../errors";
import { badRequest, serverError, success, unauthorized } from "../../helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";


export class ListFilmsController implements Controller {
  constructor(private readonly decrypter: Decrypter) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const inputs = ['token', 'order'];

      for(const input of inputs) {
        if(!request.body[input])
          return badRequest(new MissingParamError(input));
      }

      const { token, order } = request.body;

      return success(this.decrypter.decrypt(token));
    } catch(e: any) {
      return unauthorized(new AccessDeniedError());
    }
  }
}
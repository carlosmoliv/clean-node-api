import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password } = httpRequest.body

    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)

    try {
      const account = await this.addAccount.add({
        name: name,
        email: email,
        password: password,
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

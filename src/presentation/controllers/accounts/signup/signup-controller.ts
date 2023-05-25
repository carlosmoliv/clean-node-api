import { EmailInUseError } from '../../../errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper'
import {
  AddAccount,
  Authentication,
  Controller,
  HttpResponse,
  Validation,
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    const { name, email, password } = request

    const error = this.validation.validate(request)
    if (error) return badRequest(error)

    try {
      const account = await this.addAccount.add({
        name: name,
        email: email,
        password: password,
      })

      if (!account) return forbidden(new EmailInUseError())

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      })

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}

import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from './signup.protocols'

export class SignUpController implements Controller {
  private readonly emailValidatorStup: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidatorStup: EmailValidator, addAccount: AddAccount) {
    this.emailValidatorStup = emailValidatorStup
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    const { name, email, password, passwordConfirmation } = httpRequest.body

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))

      const isValid = this.emailValidatorStup.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      const account = this.addAccount.add({
        name: name,
        email: email,
        password: password,
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}

import { AddAccount } from '../../domain/use-cases/add-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../protocols'

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

      this.addAccount.add({
        name: name,
        email: email,
        password: password,
      })

      return {
        statusCode: 200,
        body: 'OK',
      }
    } catch (error) {
      return serverError()
    }
  }
}

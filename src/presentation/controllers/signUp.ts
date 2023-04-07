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

  constructor(emailValidatorStup: EmailValidator) {
    this.emailValidatorStup = emailValidatorStup
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidatorStup.isValid(httpRequest.body.email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      return {
        statusCode: 200,
        body: 'OK',
      }
    } catch (error) {
      return serverError()
    }
  }
}

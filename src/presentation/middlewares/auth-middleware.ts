import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  LoadAccountByToken,
  Middleware,
} from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    try {
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        )
        if (account) return ok({ accountId: account.id })
      }

      const error = forbidden(new AccessDeniedError())

      return new Promise((resolve) => resolve(error))
    } catch (error) {
      return serverError(error)
    }
  }
}

import { forbidden, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { ok } from '../helpers/http/http-helper'
import {
  AccountModel,
  HttpRequest,
  LoadAccountByToken,
} from './auth-middleware-protocols'
import { mockAccountModel } from '@/domain/test'
import { mockLoadAccountByToken } from '../test'

const mockFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()

  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut('any_role')

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(mockFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValue(null)

    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockFakeRequest())

    expect(httpResponse).toEqual(
      ok({
        accountId: 'any_id',
      })
    )
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

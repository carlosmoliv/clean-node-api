import { LoginController } from './login-controller'
import { MissingParamError, ServerError } from '../../../errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { faker } from '@faker-js/faker'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()

  const sut = new LoginController(authenticationSpy, validationSpy)

  return {
    sut,
    authenticationSpy,
    validationSpy,
  }
}

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password,
    })
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.authenticationModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  it('Should call Validation with the correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(validationSpy.input).toEqual(request)
  })

  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.word.sample())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})

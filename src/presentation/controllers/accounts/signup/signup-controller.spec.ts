import {
  EmailInUseError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors'
import { SignUpController } from './signup-controller'

import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import {
  AuthenticationSpy,
  ValidationSpy,
  AddAccountSpy,
} from '@/presentation/test'
import { faker } from '@faker-js/faker'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  }
}

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()

  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy
  )

  return { sut, addAccountSpy, validationSpy, authenticationSpy }
}

describe('SignUp Controller', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password,
    })
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = false

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('Should return 200 if valid data is provided', async () => {
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

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password,
    })
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

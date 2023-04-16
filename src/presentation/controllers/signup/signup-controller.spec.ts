import { MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup-controller'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
  Authentication,
  AuthenticationModel,
} from './signup-controller-protocols'
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'John Doe',
    email: 'johndoe_invalid_email@mail.com',
    password: '123456',
    passwordConfirmation: '123456',
  },
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()

  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )

  return { sut, addAccountStub, validationStub, authenticationStub }
}

describe('SignUp Controller', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'johndoe_invalid_email@mail.com',
      password: '123456',
    })
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(serverError(new ServerError()))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(ok(makeFakeAccount()))
  })

  it('Should call Validation with the correct value', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_value'))

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(badRequest(new MissingParamError('any_value')))
  })
})

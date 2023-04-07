import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signUp'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return { sut, emailValidatorStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if name is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'johndoe@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if email is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if password is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if password confirmation is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe_invalid_email@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe_invalid_email@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('johndoe_invalid_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error()
      }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe_any_email@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(500)
    expect(httResponse.body).toEqual(new ServerError())
  })
})

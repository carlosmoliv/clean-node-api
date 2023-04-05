import { MissingParamError } from '../errors/missing-param.error'
import { SignUpController } from './signUp'

const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  it('Should return 400 if name is not provided', () => {
    const sut = makeSut()

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
    const sut = makeSut()

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
    const sut = makeSut()

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
    const sut = makeSut()

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
})

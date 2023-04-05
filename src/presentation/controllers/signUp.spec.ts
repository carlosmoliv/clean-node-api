import { SignUpController } from './signUp'

describe('SignUp Controller', () => {
  it('Should return 400 if name is not provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'johndoe@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new Error('Missing param: name'))
  })

  it('Should return 400 if email is not provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'John Doe',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
    expect(httResponse.body).toEqual(new Error('Missing param: email'))
  })
})

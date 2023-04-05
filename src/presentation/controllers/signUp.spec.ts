import { SignUpController } from './signUp'

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    }

    const httResponse = sut.handle(httpRequest)
    expect(httResponse.statusCode).toBe(400)
  })
})

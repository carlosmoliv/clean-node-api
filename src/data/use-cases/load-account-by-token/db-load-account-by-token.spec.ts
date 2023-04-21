import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken Usecase', () => {
  const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve('any_value'))
      }
    }

    return new DecrypterStub()
  }

  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypter()
    const sut = new DbLoadAccountByToken(decrypterStub)

    return {
      sut,
      decrypterStub,
    }
  }

  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()

    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token', 'any_role')

    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const account = await sut.load('any_token')

    expect(account).toBeNull()
  })
})

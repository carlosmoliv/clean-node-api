import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

describe('DbLoadAccountByToken Usecase', () => {
  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
  })

  const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve('any_value'))
      }
    }

    return new DecrypterStub()
  }

  const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(token: string, role?: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(makeFakeAccount()))
      }
    }

    return new LoadAccountByTokenRepositoryStub()
  }
  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAcountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypter()
    const loadAcountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(
      decrypterStub,
      loadAcountByTokenRepositoryStub
    )

    return {
      sut,
      decrypterStub,
      loadAcountByTokenRepositoryStub,
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

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAcountByTokenRepositoryStub } = makeSut()

    const decrypterSpy = jest.spyOn(
      loadAcountByTokenRepositoryStub,
      'loadByToken'
    )

    await sut.load('any_token', 'any_role')

    expect(decrypterSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAcountByTokenRepositoryStub } = makeSut()

    jest
      .spyOn(loadAcountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeNull()
  })

  it('should return an account', async () => {
    const { sut } = makeSut()

    const account = await sut.load('any_token', 'any_role')

    expect(account).toEqual(makeFakeAccount())
  })
})

import { mockDecrypter } from '@/data/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols'
import { mockAccountModel, throwError } from '@/domain/test'

describe('DbLoadAccountByToken Usecase', () => {
  const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(token: string, role?: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(mockAccountModel()))
      }
    }

    return new LoadAccountByTokenRepositoryStub()
  }
  type SutTypes = {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAcountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = mockDecrypter()
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

    expect(account).toEqual(mockAccountModel())
  })

  it('should throws if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)

    const promise = sut.load('any_token')

    await expect(promise).rejects.toThrow()
  })

  it('should throws if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAcountByTokenRepositoryStub } = makeSut()

    jest
      .spyOn(loadAcountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError)

    const promise = sut.load('any_token')

    await expect(promise).rejects.toThrow()
  })
})

import {
  mockAccountModel,
  mockFakeAuthentication,
  throwError,
} from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols'
import {
  mockEncrypter,
  mockHashComparer,
  mockUpdateAccessTokenRepository,
} from '@/data/test'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  EncrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const EncrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    EncrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    EncrypterStub,
    updateAccessTokenRepositoryStub,
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepositoryStub throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockFakeAuthentication())

    expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)

    const accesstoken = await sut.auth(mockFakeAuthentication())

    expect(accesstoken).toBeNull()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(mockFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)

    const promise = sut.auth(mockFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accesstoken = await sut.auth(mockFakeAuthentication())

    expect(accesstoken).toBeNull()
  })

  it('Should call Encrypter with correct id', async () => {
    const { sut, EncrypterStub } = makeSut()

    const encrypterSpy = jest.spyOn(EncrypterStub, 'encrypt')

    await sut.auth(mockFakeAuthentication())

    expect(encrypterSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw Encrypter throws', async () => {
    const { sut, EncrypterStub } = makeSut()

    jest.spyOn(EncrypterStub, 'encrypt').mockImplementationOnce(throwError)

    const promise = sut.auth(mockFakeAuthentication())

    expect(promise).rejects.toThrow()
  })

  it('Should return a token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(mockFakeAuthentication())

    expect(accessToken).toBe('any_token')
  })

  it('Should call  with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )

    await sut.auth(mockFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockFakeAuthentication())

    expect(promise).rejects.toThrow()
  })
})

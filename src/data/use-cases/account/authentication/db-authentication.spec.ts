import { throwError, mockAuthenticationParams } from '@/domain/test'

import { DbAuthentication } from './db-authentication'

import {
  HashComparerSpy,
  EncrypterSpy,
  UpdateAccessTokenRepositorySpy,
  LoadAccountByEmailRepositorySpy,
} from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(
      authenticationParams.email
    )
  })

  it('should throw if LoadAccountByEmailRepositoryStub throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())

    expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = null

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()

    await sut.auth(authenticationParams)

    expect(hashComparerSpy.plaintext).toBe(authenticationParams.password)
    expect(hashComparerSpy.digest).toBe(
      loadAccountByEmailRepositorySpy.accountModel.password
    )
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()

    hashComparerSpy.isValid = false
    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBeNull()
  })

  it('should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(encrypterSpy.plaintext).toBe(
      loadAccountByEmailRepositorySpy.accountModel.id
    )
  })

  it('should throw Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())

    expect(promise).rejects.toThrow()
  })

  it('should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut()

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBe(encrypterSpy.ciphertext)
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      loadAccountByEmailRepositorySpy,
      encrypterSpy,
    } = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByEmailRepositorySpy.accountModel.id
    )
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })
})

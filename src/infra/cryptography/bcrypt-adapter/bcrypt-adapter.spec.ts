import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  },
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  it('should call hash with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBe(true)
  })

  // it('should return false when compare fails', async () => {
  //   const sut = makeSut()

  //   jest
  //     .spyOn(bcrypt, 'compare')
  //     .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

  //   const isValid = await sut.compare('any_value', 'any_hash')

  //   expect(isValid).toBe(false)
  // })

  // it('should throw an error if bcrypt also throws', async () => {
  //   const sut = makeSut()

  //   jest
  //     .spyOn(bcrypt, 'hash')
  //     .mockReturnValueOnce(
  //       new Promise((resolve, reject) => reject(new Error()))
  //     )

  //   // jest
  //   //   .spyOn(bcrypt, 'hash')
  //   //   .mockImplementationOnce(
  //   //     () => new Promise((resolve, reject) => reject(new Error()))
  //   //   )

  //   const promise = sut.hash('any_value')

  //   await expect(promise).rejects.toThrow()
  // })
})
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

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

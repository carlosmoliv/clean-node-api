import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        }

        return new Promise((resolve) => resolve(account))
      }
    }

    const loadAccountByEmailRepositopryStub =
      new LoadAccountByEmailRepositoryStub()

    const sut = new DbAuthentication(loadAccountByEmailRepositopryStub)

    const loadSpy = jest.spyOn(loadAccountByEmailRepositopryStub, 'load')

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})

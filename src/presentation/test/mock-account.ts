import { AddAccount } from '../controllers/accounts/signup/signup-controller-protocols'
import { Authentication } from '../controllers/accounts/login/login-controller-protocols'
import { LoadAccountByToken } from '@/domain/use-cases/account/load-account-by-token'
import { faker } from '@faker-js/faker'

export class AddAccountSpy implements AddAccount {
  result = true
  addAccountParams: AddAccount.Params

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  authenticationModel = {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName(),
  }

  async auth(
    authenticationParams: Authentication.Params
  ): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams
    return this.authenticationModel
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result = { id: faker.string.uuid() }
  accessToken: string
  role: string

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role

    return this.result
  }
}

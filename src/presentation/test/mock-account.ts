import { mockAccountModel } from '@/domain/test'
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
} from '../controllers/accounts/signup/signup-controller-protocols'
import {
  Authentication,
  AuthenticationParams,
} from '../controllers/accounts/login/login-controller-protocols'
import { LoadAccountByToken } from '@/domain/use-cases/account/load-account-by-token'
import { faker } from '@faker-js/faker'

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add(account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account
    return Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  token = faker.string.uuid()

  async auth(authenticationParams: AuthenticationParams): Promise<string> {
    this.authenticationParams = authenticationParams
    return Promise.resolve(this.token)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel()
  accessToken: string
  role: string

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}

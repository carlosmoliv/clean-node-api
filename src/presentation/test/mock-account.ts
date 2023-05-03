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

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenStub()
}

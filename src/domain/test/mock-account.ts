import { faker } from '@faker-js/faker'
import { AccountModel } from '../models/account'
import { AuthenticationParams } from '../use-cases/account/authentication'
import { AddAccount } from '../use-cases/account/add-account'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

export const mockAccountModel = (): AccountModel => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})

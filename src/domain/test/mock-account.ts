import { faker } from '@faker-js/faker'
import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/use-cases/account/add-account'
import { Authentication } from '@/domain/use-cases/account/authentication'

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

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})

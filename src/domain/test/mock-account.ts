import { faker } from '@faker-js/faker'
import { AccountModel } from '../models/account'
import { AddAccountParams } from '../use-cases/account/add-account'
import { AuthenticationParams } from '../use-cases/account/authentication'

export const mockAddAccountParams = (): AddAccountParams => ({
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

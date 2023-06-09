import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repositpory'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '@/domain/use-cases/account/add-account'
import { DbAddAccount } from '@/data/use-cases/account/add-account/db-add-account'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}

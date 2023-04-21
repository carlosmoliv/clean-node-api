import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repositpory'
import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '../../../../../domain/use-cases/add-account'
import { DbAddAccount } from '../../../../../data/use-cases/add-account/db-add-account'
import { LoadAccountByToken } from '../../../../../domain/use-cases/load-account-by-token'
import { DbLoadAccountByToken } from '../../../../../data/use-cases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}

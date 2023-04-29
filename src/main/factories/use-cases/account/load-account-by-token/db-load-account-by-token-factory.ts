import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repositpory'
import { LoadAccountByToken } from '@/domain/use-cases/account/load-account-by-token'
import { DbLoadAccountByToken } from '@/data/use-cases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}

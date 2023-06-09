import env from '../../../../config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repositpory'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { Authentication } from '@/domain/use-cases/account/authentication'
import { DbAuthentication } from '@/data/use-cases/account/authentication/db-authentication'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}

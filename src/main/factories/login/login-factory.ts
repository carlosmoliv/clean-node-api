import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeLoginValidation } from './login-validation-factory'
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repositpory'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'

export const makeLoginCOntroller = (): Controller => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )

  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  )

  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}

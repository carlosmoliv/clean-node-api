import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { LoginController } from '../../../../presentation/controllers/accounts/login/login-controller'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  )

  return makeLogControllerDecorator(controller)
}

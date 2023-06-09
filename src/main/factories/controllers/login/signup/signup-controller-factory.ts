import { SignUpController } from '../../../../../presentation/controllers/accounts/signup/signup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../../use-cases/account/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../../use-cases/account/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  )

  return makeLogControllerDecorator(controller)
}

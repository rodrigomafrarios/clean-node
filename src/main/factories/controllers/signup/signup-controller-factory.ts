import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../usecases/decorators/log-controller-decorator-factory'
import { Controller } from '../../../../presentation/protocols/controller'
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'

export const makeSignUpController = (): Controller => {
	const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(),makeDbAuthentication())
	return makeLogControllerDecorator(controller)
}

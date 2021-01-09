import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
	const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
	return makeLogControllerDecorator(controller)
}

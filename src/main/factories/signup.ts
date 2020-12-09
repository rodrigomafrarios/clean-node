import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/emal-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): SignUpController => {
	const salt = 12
	const emailValidator = new EmailValidatorAdapter()
	const bcryptAdapter = new BcryptAdapter(salt)
	const addAccountRepository = new AccountMongoRepository()
	const dbAddAccount = new DbAddAccount(bcryptAdapter,addAccountRepository)
	const signUpController = new SignUpController(emailValidator,dbAddAccount)
	return new LogControllerDecorator(signUpController)
}

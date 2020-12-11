import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeSignUpValidation } from './signup-validation'
export const makeSignUpController = (): SignUpController => {
	const salt = 12
	const bcryptAdapter = new BcryptAdapter(salt)
	const addAccountRepository = new AccountMongoRepository()
	const dbAddAccount = new DbAddAccount(bcryptAdapter,addAccountRepository)
	const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
	const logMongoRepository = new LogMongoRepository()
	return new LogControllerDecorator(signUpController, logMongoRepository)
}

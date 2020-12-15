import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'
import { adaptRoute } from '../adapters/express-routes-adapter'
export default (router: Router): void => {
	router.post('/signup', adaptRoute(makeSignUpController()))
	router.post('/login', adaptRoute(makeLoginController()))
}

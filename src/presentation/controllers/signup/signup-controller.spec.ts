import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, Validation, Authentication, AuthenticationModel, HttpRequest } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

interface StubType {
	controllerStub: SignUpController
	addAccountStub: AddAccount
	validationStub: Validation
	authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any_mail@mail.com',
		password: 'any_password'
	}
})

const factoryAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add (account: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_mail@mail.com',
				password: 'valid_password'
			}
			return new Promise(resolve => resolve(fakeAccount))
		}
	}
	return new AddAccountStub()
}
const factoryValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate (input: any): any {
			return null
		}
	}
	return new ValidationStub()
}
const factoryAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth (authentication: AuthenticationModel): Promise<string> {
			return new Promise(resolve => resolve('any_token'))
		}
	}
	return new AuthenticationStub()
}
const factoryController = (): StubType => {
	const authenticationStub = factoryAuthentication()
	const addAccountStub = factoryAddAccount()
	const validationStub = factoryValidation()
	const controllerStub = new SignUpController(addAccountStub, validationStub, authenticationStub)
	return {
		controllerStub,
		addAccountStub,
		validationStub,
		authenticationStub
	}
}

describe('SignUp Controller', () => {
	test('Sould call AddAccount with correct values', async () => {
		const { controllerStub, addAccountStub } = factoryController()
		const addSpy = jest.spyOn(addAccountStub, 'add')
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await controllerStub.handle(httpRequest)
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password'
		})
	})
	test('Should return 500 if AddAccount throws', async () => {
		const { addAccountStub, controllerStub } = factoryController()
		jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => reject(serverError(new ServerError(''))))
		})
		const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy_invalid@email.com',
				password: 'ahoy',
				passwordConfirmation: 'ahoy'
            }
        }

        const httpResponse = await controllerStub.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse).toEqual(serverError(new ServerError('')))
	})
	test('Sould call Validaton with correct value', async () => {
		const { controllerStub, validationStub } = factoryController()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await controllerStub.handle(httpRequest)
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
	})
	test('Should return 400 if Validation returns an error', async () => {
		const { controllerStub, validationStub } = factoryController()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpRequest = {
            body: {
                name: 'valid_name',
				email: 'valid_mail@mail.com',
				password: 'valid_password',
				passwordConfirmation: 'valid_password'
            }
        }

        const httpResponse = await controllerStub.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
	})
	test('Should call Authentication with correct values', async () => {
		const { controllerStub, authenticationStub } = factoryController()
		const authSpy = jest.spyOn(authenticationStub, 'auth')
		await controllerStub.handle(makeFakeRequest())
		expect(authSpy).toHaveBeenCalledWith({ email: 'any_mail@mail.com', password: 'any_password' })
	})
	test('Should return 500 if Authentication throws', async () => {
		const { controllerStub, authenticationStub } = factoryController()
		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const httpResponse = await controllerStub.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new Error()))
	})
	test('Should return 200 if valid credentials are provided', async () => {
		const { controllerStub } = factoryController()
		const httpResponse = await controllerStub.handle(makeFakeRequest())
		expect(httpResponse.statusCode).toBe(200)
		expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
	})
})

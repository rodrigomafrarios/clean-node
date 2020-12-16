import { LoginController } from './login-controller'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'
import { MissingParamError } from '../../errors'
import { Authentication, AuthenticationModel, HttpRequest, Validation } from './login-controller-protocols'
interface SutTypes {
	sut: LoginController
	authenticationStub: Authentication
	validationStub: Validation
}
const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate (input: any): any {
			return null
		}
	}
	return new ValidationStub()
}
const makeSut = (): SutTypes => {
	const authenticationStub = makeAuthentication()
	const validationStub = makeValidation()
	const sut = new LoginController(authenticationStub, validationStub)
	return {
		sut,
		authenticationStub,
		validationStub
	}
}
const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any_mail@mail.com',
		password: 'any_password'
	}
})
const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth (authentication: AuthenticationModel): Promise<string> {
			return new Promise(resolve => resolve('any_token'))
		}
	}
	return new AuthenticationStub()
}

describe('Login Controller', () => {
	test('Should return 401 if invalid credentials are provided', async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(unauthorized())
	})
	test('Should return 500 if Authentication throws', async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new Error()))
	})
	test('Should return 200 if valid credentials are provided', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
	})
	test('Sould call Validaton with correct value', async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		await sut.handle(httpRequest)
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
	})
	test('Should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpRequest = {
            body: {
                name: 'valid_name',
				email: 'valid_mail@mail.com',
				password: 'valid_password',
				passwordConfirmation: 'valid_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
	})
})

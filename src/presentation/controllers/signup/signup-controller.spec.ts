import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, Validation } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

interface StubType {
	controllerStub: SignUpController
	addAccountStub: AddAccount
	validationStub: Validation
}

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
const factoryController = (): StubType => {
	const addAccountStub = factoryAddAccount()
	const validationStub = factoryValidation()
	const controllerStub = new SignUpController(addAccountStub, validationStub)
	return {
		controllerStub,
		addAccountStub,
		validationStub
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
	test('Should return 200 if valid data is provided', async () => {
		const { controllerStub } = factoryController()
        const httpRequest = {
            body: {
                name: 'valid_name',
				email: 'valid_mail@mail.com',
				password: 'valid_password',
				passwordConfirmation: 'valid_password'
            }
        }

        const httpResponse = await controllerStub.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(200)
		expect(httpResponse).toEqual(ok({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_mail@mail.com',
			password: 'valid_password'
		}))
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
})

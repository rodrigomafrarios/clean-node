import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'

interface StubType {
	controllerStub: SignUpController
	emailValidatorStub: EmailValidator
	addAccountStub: AddAccount
	validatonStub: Validation
}
const factoryEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
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
		validate (input: any): Error {
			return new Error()
		}
	}
	return new ValidationStub()
}
const factoryController = (): StubType => {
	const emailValidatorStub = factoryEmailValidator()
	const addAccountStub = factoryAddAccount()
	const validatonStub = factoryValidation()
	const controllerStub = new SignUpController(emailValidatorStub, addAccountStub, validatonStub)
	return {
		controllerStub,
		emailValidatorStub,
		addAccountStub,
		validatonStub
	}
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name provided', async () => {
		const factory = factoryController()
        const httpRequest = {
            body: {
                email: 'anmy@email.com',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = await factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})
	test('Should return 400 if no email provided', async () => {
		const factory = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = await factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})
	test('Should return 400 if no password provided', async () => {
        const factory = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'anmy@email.com',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = await factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})
	test('Should return 400 if no confirmation provided', async () => {
        const factory = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy@email.com',
				password: 'ahoy'
            }
        }

        const httpResponse = await factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
	})
	test('Should return 400 if an invalid email provided', async () => {
		const { emailValidatorStub, controllerStub } = factoryController()
		jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any',
				email: 'safdsasdf',
				password: 'ahoy',
				passwordConfirmation: 'ahoy'
            }
        }

        const httpResponse = await controllerStub.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})
	test('Should call EmailValidator with correct email', async () => {
		const factory = factoryController()
		const isValidSpy = jest.spyOn(factory.emailValidatorStub,'isValid')
        const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy_invalid@email.com',
				password: 'ahoy',
				passwordConfirmation: 'ahoy'
            }
		}
		await factory.controllerStub.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith('anmy_invalid@email.com')
	})
	test('Should return 500 if EmailValidator throws', async () => {
		const { emailValidatorStub, controllerStub } = factoryController()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error()
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
		expect(httpResponse.body).toEqual(new ServerError(''))
	})
	test('Should return 400 if password confirmation fails', async () => {
		const { controllerStub } = factoryController()
		const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy_invalid@email.com',
				password: 'ahoy',
				passwordConfirmation: 'any confirmation'
            }
		}
		const httpResponse = await controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
	})
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
			return new Promise((resolve, reject) => reject(new Error()))
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
		expect(httpResponse.body).toEqual(new ServerError(''))
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
		expect(httpResponse.body).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_mail@mail.com',
			password: 'valid_password'
		})
	})
	test('Sould call Validaton with correct value', async () => {
		const { controllerStub, validatonStub } = factoryController()
		const validateSpy = jest.spyOn(validatonStub, 'validate')
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
})

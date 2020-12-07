import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

interface StubType {
	controllerStub: SignUpController
	emailValidatorStub: EmailValidator
}
const factoryEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}
const factoryController = (): StubType => {
	const emailValidatorStub = factoryEmailValidator()
	const controllerStub = new SignUpController(emailValidatorStub)
	return {
		controllerStub,
		emailValidatorStub
	}
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name provided', () => {
		const factory = factoryController()
        const httpRequest = {
            body: {
                email: 'anmy@email.com',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})
	test('Should return 400 if no email provided', () => {
		const factory = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})
	test('Should return 400 if no password provided', () => {
        const factory = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'anmy@email.com',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})
	test('Should return 400 if no confirmation provided', () => {
        const factory = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy@email.com',
				password: 'ahoy'
            }
        }

        const httpResponse = factory.controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
	})
	test('Should return 400 if an invalid email provided', () => {
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

        const httpResponse = controllerStub.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})
	test('Should call EmailValidator with correct email', () => {
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
		factory.controllerStub.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith('anmy_invalid@email.com')
	})
	test('Should return 500 if EmailValidator throws', () => {
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

        const httpResponse = controllerStub.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})
	test('Should return 400 if password confirmation fails', () => {
		const { controllerStub } = factoryController()
		const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy_invalid@email.com',
				password: 'ahoy',
				passwordConfirmation: 'any confirmation'
            }
		}
		const httpResponse = controllerStub.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
	})
})

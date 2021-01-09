import { EmailValidation } from './email-validation'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/presentation/protocols/email-validator'

interface StubType {
	controllerStub: EmailValidation
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
	const controllerStub = new EmailValidation('email',emailValidatorStub)
	return {
		controllerStub,
		emailValidatorStub
	}
}

describe('EmailValidation', () => {
	test('Should return an error if EmailValidator returns false', () => {
		const { controllerStub, emailValidatorStub } = factoryController()
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const error = controllerStub.validate({ email: 'anmy_invalid@email.com' })
		expect(error).toEqual(new InvalidParamError('email'))
	})
	test('Should call EmailValidator with correct email', () => {
		const { controllerStub, emailValidatorStub } = factoryController()
		const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
		controllerStub.validate({ email: 'anmy_invalid@email.com' })
		expect(isValidSpy).toHaveBeenCalledWith('anmy_invalid@email.com')
	})
	test('Should throw if EmailValidator throws', async () => {
		const { emailValidatorStub, controllerStub } = factoryController()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error()
		})
		expect(controllerStub.validate).toThrow()
	})
})

import { EmailValidatorAdapter } from '@/utils/email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
	isEmail (): boolean {
		return true
	}
}))

const factory = (): EmailValidatorAdapter => {
	return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
	test('Should return false if validator returns false', () => {
		const sut = factory()
		jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
		const isValid = sut.isValid('invalid_email')
		expect(isValid).toBe(false)
	})
	test('Should return true if validator returns true', () => {
		const sut = factory()
		const isValid = sut.isValid('valid_email@mail.com')
		expect(isValid).toBe(true)
	})
	test('Should call validator with correct', () => {
		const sut = factory()
		const isEmailSpy = jest.spyOn(validator, 'isEmail')
		sut.isValid('valid_email@mail.com')
		expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
	})
})

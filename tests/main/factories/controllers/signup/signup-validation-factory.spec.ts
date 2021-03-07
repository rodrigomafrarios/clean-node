import { ValidationComposite, RequiredFieldValidation, EmailValidation, CompareFieldsValidation } from '@/presentation/helpers/validators'
import { Validation } from '@/presentation/protocols/validation'
import { makeSignUpValidation } from '@/main/factories/controllers/signup/signup-validation-factory'
import { EmailValidator } from '@/presentation/protocols/email-validator'
jest.mock('@/presentation/helpers/validators/validation-composite')

const factoryEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation()
		const validations: Validation[] = []
		for (const field of ['name','email','password','passwordConfirmation']) {
			validations.push(new RequiredFieldValidation(field))
		}
		validations.push(new CompareFieldsValidation('password','passwordConfirmation'))
		validations.push(new EmailValidation('email',factoryEmailValidator()))
		expect(ValidationComposite).toHaveBeenCalledWith(validations)
	})
})

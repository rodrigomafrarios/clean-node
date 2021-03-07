import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite'
interface SutTypes {
	sut: ValidationComposite
	validationStubs: Validation[]
}
const makeValidator = (): Validation => {
	class ValidationStub implements Validation {
		validate (input: any): Error | undefined {
			return undefined
		}
	}
	return new ValidationStub()
}

const makeSut = (): SutTypes => {
	const validationStubs = [makeValidator(),makeValidator()]
	const sut = new ValidationComposite(validationStubs)
	return {
		sut,
		validationStubs
	}
}

describe('Validation Composite', () => {
	test('Should return an error if any validation fails', () => {
		const { sut, validationStubs } = makeSut()
		jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
		const error = sut.validate({ field: 'any_value' })
		expect(error).toEqual(new MissingParamError('field'))
	})
	test('Should return an error if more then one validation fails', () => {
		const { sut, validationStubs } = makeSut()
		jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
		jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
		const error = sut.validate({ field: 'any_value' })
		expect(error).toEqual(new Error())
	})
	test('Should not return if validation succeeds', () => {
		const { sut } = makeSut()
		const error = sut.validate({ field: 'any_value' })
		expect(error).toBeFalsy()
	})
})

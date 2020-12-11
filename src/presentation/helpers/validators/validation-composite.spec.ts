import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'
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
	test('Should return an error if more then one validation fails', () => {
		const { sut, validationStubs } = makeSut()
		jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
		jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
		const error = sut.validate({ field: 'any_value' })
		expect(error).toEqual(new Error())
	})
})

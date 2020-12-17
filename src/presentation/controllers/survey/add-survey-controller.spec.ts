import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

interface SutTypes {
	sut: AddSurveyController
	validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: ''
		}]
	}
})

const makeValidator = (): Validation => {
	class ValidationStub implements Validation {
		validate (input: any): Error | undefined {
			return null
		}
	}
	return new ValidationStub()
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidator()
	const sut = new AddSurveyController(validationStub)
	return {
		sut,
		validationStub
	}
}

describe('AddSurvey Controller', () => {
	test('Should call validation with correct values', async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		await sut.handle(makeFakeRequest())
		expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
	})
})

import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
	body: {
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: ''
		}]
	}
})

describe('AddSurvey Controller', () => {
	test('Should call validation with correct values', async () => {
		class ValidationStub implements Validation {
			validate (input: any): Error | undefined {
				return null
			}
		}
		const validationStub = new ValidationStub()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		const sut = new AddSurveyController(validationStub)
		await sut.handle(makeFakeRequest())
		expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
	})
})

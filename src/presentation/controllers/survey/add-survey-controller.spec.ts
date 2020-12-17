import { HttpRequest, Validation, InvalidParamError, badRequest, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

interface SutTypes {
	sut: AddSurveyController
	validationStub: Validation
	addSurveyStub: AddSurvey
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
const makeAddSurvey = (): AddSurvey => {
	class AddSurveyStub implements AddSurvey {
		async add (data: AddSurveyModel): Promise<void> {
			return new Promise(resolve => resolve())
		}
	}
	return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidator()
	const addSurveyStub = makeAddSurvey()
	const sut = new AddSurveyController(validationStub,addSurveyStub)
	return {
		sut,
		validationStub,
		addSurveyStub
	}
}

describe('AddSurvey Controller', () => {
	test('Should call validation with correct values', async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, 'validate')
		await sut.handle(makeFakeRequest())
		expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
	})
	test('Should return 400 if validation fails', async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('any_field'))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('any_field')))
	})
	test('Should call addSurvey with correct values', async () => {
		const { sut, addSurveyStub } = makeSut()
		const addSpy = jest.spyOn(addSurveyStub, 'add')
		await sut.handle(makeFakeRequest())
		expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
	})
})

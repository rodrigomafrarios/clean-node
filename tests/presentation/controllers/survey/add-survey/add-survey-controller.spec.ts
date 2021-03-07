import { HttpRequest, Validation, InvalidParamError, badRequest, serverError, noContent, AddSurvey } from '@/presentation/controllers/survey/add-survey/add-survey-controller-protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { mockAddSurvey } from '@/tests/presentation/mocks/mock-survey'
import MockDate from 'mockdate'

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
		}],
		date: new Date()
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
	const addSurveyStub = mockAddSurvey()
	const sut = new AddSurveyController(validationStub,addSurveyStub)
	return {
		sut,
		validationStub,
		addSurveyStub
	}
}

describe('AddSurvey Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})
	afterAll(() => {
		MockDate.reset()
	})
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
	test('Should return 500 if addSurvey throws', async () => {
		const { sut, addSurveyStub } = makeSut()
		jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new Error()))
	})
	test('Should return 204 on success', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(noContent())
	})
})

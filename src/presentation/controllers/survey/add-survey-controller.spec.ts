import { HttpRequest, Validation, InvalidParamError, badRequest, serverError, noContent, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import MockDate from 'mockdate'

interface SutTypes {
	sut: AddSurveyController
	validationStub: Validation
	addSurveyStub: AddSurvey
}

const date = new Date()

const makeFakeRequest = (): HttpRequest => ({
	body: {
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: ''
		}],
		date: date
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
	beforeAll(() => {
		MockDate.set(date)
	})
	beforeAll(() => {
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
		jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(serverError(new Error()))
	})
	test('Should return 204 on success', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(noContent())
	})
})

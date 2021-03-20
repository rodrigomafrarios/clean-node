import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { throwError } from '@/tests/domain/mocks'
import { mockLoadSurveyById } from '@/tests/presentation/mocks'

type SutTypes = {
	sut: LoadSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
}

const mockRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any-id'
	}
})

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = mockLoadSurveyById()
	const sut = new LoadSurveyResultController(loadSurveyByIdStub)
	return {
		sut,
		loadSurveyByIdStub
	}
}

describe('Controller - LoadSurveyResult', () => {
	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
		await sut.handle(mockRequest())
		expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any-id')
	})

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValue(null)
		const results = await sut.handle(mockRequest())
		expect(results).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Shoul return 500 if LoadSurveyById throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
		const response = await sut.handle(mockRequest())
		expect(response).toEqual(serverError(new Error()))
	})
})

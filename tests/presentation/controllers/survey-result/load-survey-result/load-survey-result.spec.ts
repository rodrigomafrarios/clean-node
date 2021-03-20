import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { mockFakeSurveyResultModel, throwError } from '@/tests/domain/mocks'
import { mockLoadSurveyById } from '@/tests/presentation/mocks'

type SutTypes = {
	sut: LoadSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
	loadSurveyResultStub: LoadSurveyResult
}

const mockRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any-id',
		accountId: 'any-account-id'
	}
})

const mockLoadSurveyResult = (): LoadSurveyResult => {
	class LoadSurveyResultStub implements LoadSurveyResult {
		async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
			return Promise.resolve(mockFakeSurveyResultModel())
		}
	}
	return new LoadSurveyResultStub()
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = mockLoadSurveyById()
	const loadSurveyResultStub = mockLoadSurveyResult()
	const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
	return {
		sut,
		loadSurveyByIdStub,
		loadSurveyResultStub
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

	test('Should call LoadSurveyResult with correct value', async () => {
		const { sut, loadSurveyResultStub } = makeSut()
		const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultStub, 'load')
		await sut.handle(mockRequest())
		expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any-id', 'any-account-id')
	})
})

import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import {
	HttpRequest,
	LoadSurveyById,
	SaveSurveyResult,
	SaveSurveyResultParams,
	SurveyResultModel
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-protocols'
import MockDate from 'mockdate'
import { mockLoadSurveyById } from '@/tests/presentation/mocks'

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
	saveSurveyResultStub: SaveSurveyResult
}

const makeFakeRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any-id'
	},
	body: {
		answer: 'any-answer'
	},
	accountId: 'any-account-id'
})

const fakeSurveyResult = (): SurveyResultModel => ({
	surveyId: 'valid-survey-id',
	question: 'any_question',
	answers: [{
		image: 'image1',
		answer: 'any-answer',
		count: 0,
		percent: 0
	}],
	date: new Date()
})

const makeSaveSurveyResult = (): SaveSurveyResult => {
	class SaveSurveyResultStub implements SaveSurveyResult {
		async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
			return Promise.resolve(fakeSurveyResult())
		}
	}
	return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = mockLoadSurveyById()
	const saveSurveyResultStub = makeSaveSurveyResult()
	const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
	return {
		sut,
		loadSurveyByIdStub,
		saveSurveyResultStub
	}
}

describe('SaveSurveyResult Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
		await sut.handle(makeFakeRequest())
		expect(loadSpy).toHaveBeenCalledWith('any-id')
	})

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Should return 500 if LoadSurveyById throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest.spyOn(loadSurveyByIdStub, 'loadById')
		.mockRejectedValueOnce(new Error())
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(serverError(new Error()))
	})

	test('Should return 403 if an invalid answer is provided', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle({
				params: {
				surveyId: 'any-id'
				},
				body: {
					answer: 'wrong-answer'
				}
			}
		)
		expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
	})

	test('Should call SaveSurveyResult with correct values', async () => {
		const { sut, saveSurveyResultStub } = makeSut()
		const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
		await sut.handle(makeFakeRequest())
		expect(saveSpy).toHaveBeenCalledWith({
			surveyId: 'any-id',
			accountId: 'any-account-id',
			answer: 'any-answer',
			date: new Date()
		})
	})

	test('Should return 500 if SaveSurveyResult throws', async () => {
		const { sut, saveSurveyResultStub } = makeSut()
		jest.spyOn(saveSurveyResultStub, 'save')
		.mockRejectedValueOnce(new Error())
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(serverError(new Error()))
	})

	test('Should return 200 on success', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(ok(fakeSurveyResult()))
	})
})

import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
	HttpRequest,
	LoadSurveyById,
	SurveyModel,
	SaveSurveyResult,
	SaveSurveyResultModel,
	SurveyResultModel
} from './save-survey-result-protocols.'
import MockDate from 'mockdate'

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

const makeFakeSurvey = (): SurveyModel => ({
	id: 'any-id',
	question: 'any-question',
	answers: [{
		image: 'any_image',
		answer: 'any-answer'
	}],
	date: new Date()
})

const fakeSurveyResult = (): SurveyResultModel => ({
	id: 'valid-id',
	surveyId: 'valid-survey-id',
	accountId: 'valid-account-id',
	answer: 'valid-answer',
	date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
	class LoadSurveyByIdStub implements LoadSurveyById {
		async loadById (id: string): Promise<SurveyModel> {
			return new Promise(resolve => resolve(makeFakeSurvey()))
		}
	}
	return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
	class SaveSurveyResultStub implements SaveSurveyResult {
		async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
			return new Promise(resolve => resolve(fakeSurveyResult()))
		}
	}
	return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = makeLoadSurveyById()
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
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
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

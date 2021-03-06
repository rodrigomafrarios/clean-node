import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { LoadSurveys } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/tests/domain/mocks'
import { mockLoadSurveys, mockFakeSurveys } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'

interface SutTypes {
	sut: LoadSurveysController
	loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
	const loadSurveysStub = mockLoadSurveys()
	const sut = new LoadSurveysController(loadSurveysStub)
	return {
		sut,
		loadSurveysStub
	}
}

describe('LoadSurveys Controller' ,() => {
	beforeAll(() => {
		MockDate.set(new Date())
	})
	afterAll(() => {
		MockDate.reset()
	})
	test('Should call LoadSurveys', async () => {
		const { sut, loadSurveysStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveysStub, 'load')
		await sut.handle({})
		expect(loadSpy).toHaveBeenCalled()
	})
	test('Should return 200 on success', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(ok(mockFakeSurveys()))
	})
	test('Should return 204 if LoadSurveys returns empty', async () => {
		const { sut, loadSurveysStub } = makeSut()
		jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(noContent())
	})
	test('Should return 500 if LoadSurveys throws', async () => {
		const { sut, loadSurveysStub } = makeSut()
		jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(serverError(new Error()))
	})
})

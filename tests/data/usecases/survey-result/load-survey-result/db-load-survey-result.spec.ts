import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { makeLoadSurveyResultRepository } from '@/tests/data/mocks'

type SutTypes = {
	sut: DbLoadSurveyResult
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
	const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
	return {
		sut,
		loadSurveyResultRepositoryStub
	}
}

describe('DbLoadSurveyResul - UseCase', () => {
	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut()
		const loadSurveyResultSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
		await sut.load('survey-id')
		expect(loadSurveyResultSpy).toHaveBeenLastCalledWith('survey-id')
	})
})

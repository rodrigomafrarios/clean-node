import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockFakeSurveyResultModel } from '@/tests/domain/mocks/mock-survey'
import { DbLoadSurveyResult } from './db-load-survey-result'
type SutTypes = {
	sut: DbLoadSurveyResult
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
	class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
		async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
			return Promise.resolve(mockFakeSurveyResultModel())
		}
	}
	return new LoadSurveyResultRepositoryStub()
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

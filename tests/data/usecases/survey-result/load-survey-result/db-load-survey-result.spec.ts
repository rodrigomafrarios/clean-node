import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result'
import { makeLoadSurveyResultRepository, mockLoadSurveyByIdRepository } from '@/tests/data/mocks'
import { mockFakeSurveyResultModel, throwError } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

type SutTypes = {
	sut: DbLoadSurveyResult
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
	const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
	const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
	return {
		sut,
		loadSurveyResultRepositoryStub,
		loadSurveyByIdRepositoryStub
	}
}

describe('DbLoadSurveyResul - UseCase', () => {
	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut()
		const loadSurveyResultSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
		await sut.load('survey-id', 'account-id')
		expect(loadSurveyResultSpy).toHaveBeenLastCalledWith('survey-id', 'account-id')
	})

	test('Should throw if LoadSurveyResultRepository throws', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut()
		jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
		const promise = sut.load('survey-id', 'account-id')
		await expect(promise).rejects.toThrow()
	})

	test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
		const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
		jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
		await sut.load('survey-id', 'account-id')
		expect(loadByIdSpy).toHaveBeenCalledWith('survey-id')
	})

	test('Should return surveyResultModel on success', async () => {
		const { sut } = makeSut()
		const results = await sut.load('survey-id', 'account-id')
		expect(results).toEqual(mockFakeSurveyResultModel())
	})
})

import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-survey-result-protocols'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-survey-result'
import { throwError, mockFakeSurveyResultParams, mockFakeSurveyResultModel } from '@/tests/domain/mocks'
import { mockSaveSurveyResultRepository, makeLoadSurveyResultRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

interface SutTypes {
	sut: DbSaveSurveyResult
	saveSurveyResultRepositoryStub: SaveSurveyResultRepository
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
		const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
    return {
			sut,
			saveSurveyResultRepositoryStub,
			loadSurveyResultRepositoryStub
    }
}

describe('DbSaveSurveyResult Usecase', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})
	afterAll(() => {
		MockDate.reset()
	})
	test('Should call SaveSurveyResultRepository with correct values', async () => {
		const { sut, saveSurveyResultRepositoryStub } = makeSut()
		const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
		await sut.save(mockFakeSurveyResultParams())
		expect(saveSpy).toHaveBeenCalledWith(mockFakeSurveyResultParams())
	})

	test('Should throw if SaveSurveyResultRepository throws', async () => {
		const { sut, saveSurveyResultRepositoryStub } = makeSut()
		jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
		const promise = sut.save(mockFakeSurveyResultParams())
		await expect(promise).rejects.toThrow()
	})

	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
		const surveyResultData = mockFakeSurveyResultParams()
		await sut.save(mockFakeSurveyResultParams())
		expect(loadByIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId, surveyResultData.accountId)
	})

	test('Should return SurveyResult on success', async () => {
		const { sut } = makeSut()
		const surveyResultData = await sut.save(mockFakeSurveyResultParams())
		expect(surveyResultData).toEqual(mockFakeSurveyResultModel())
	})
})

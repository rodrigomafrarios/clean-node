import { SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-survey-result-protocols'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-survey-result'
import { throwError, mockFakeSurveyResultParams, mockFakeSurveyResultModel } from '@/tests/domain/mocks'
import { mockSaveSurveyResultRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

interface SutTypes {
	sut: DbSaveSurveyResult
	saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
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

	test('Should throw if AddSurveyRepository throws', async () => {
		const { sut, saveSurveyResultRepositoryStub } = makeSut()
		jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
		const promise = sut.save(mockFakeSurveyResultParams())
		await expect(promise).rejects.toThrow()
	})

	test('Should return SurveyResult on success', async () => {
		const { sut } = makeSut()
		const surveyResultData = await sut.save(mockFakeSurveyResultParams())
		expect(surveyResultData).toEqual(mockFakeSurveyResultModel())
	})
})

import { SaveSurveyResultRepository, SurveyResultModel } from './db-survey-result-protocols'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { DbSaveSurveyResult } from './db-survey-result'
import MockDate from 'mockdate'

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
	accountId: 'any-account-id',
	surveyId: 'any-survey-id',
	answer: 'any-answer',
	date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData(), { id: 'any-id' })

interface SutTypes {
	sut: DbSaveSurveyResult
	saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
	class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
			async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
					return new Promise(resolve => resolve(makeFakeSurveyResult()))
			}
	}
	return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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
		await sut.save(makeFakeSurveyResult())
		expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResult())
	})

	test('Should throw if AddSurveyRepository throws', async () => {
		const { sut, saveSurveyResultRepositoryStub } = makeSut()
		jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => {
			reject(new Error())
		}))
		const promise = sut.save(makeFakeSurveyResult())
		await expect(promise).rejects.toThrow()
	})
})

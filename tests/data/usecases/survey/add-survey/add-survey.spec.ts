import { AddSurveyRepository } from '@/data/usecases/survey/add-survey/add-survey-protocols'
import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { throwError, mockFakeSurveyData } from '@/tests/domain/mocks'
import { mockAddSurveyRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = mockAddSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
        sut,
        addSurveyRepositoryStub
    }
}

const date = new Date()

describe('DbAddSurvey Usecase', () => {
	beforeAll(() => {
		MockDate.set(date)
	})
	afterAll(() => {
		MockDate.reset()
	})
	test('Should call AddSurveyRepository with correct values', async () => {
			const { sut, addSurveyRepositoryStub } = makeSut()
			const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
			await sut.add(mockFakeSurveyData())
			expect(addSpy).toHaveBeenCalledWith(mockFakeSurveyData())
	})
	test('Should throw if AddSurveyRepository throws', async () => {
		const { sut, addSurveyRepositoryStub } = makeSut()
		jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
		const promise = sut.add(mockFakeSurveyData())
		await expect(promise).rejects.toThrow()
	})
})

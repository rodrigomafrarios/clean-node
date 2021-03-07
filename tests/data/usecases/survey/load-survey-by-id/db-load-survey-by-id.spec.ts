import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { throwError, mockFakeSurvey } from '@/tests/domain/mocks'
import { mockLoadSurveyByIdRepository } from '@/tests/data/mocks'

type SutTypes = {
	sut: DbLoadSurveyById
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
	const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
	return {
		sut,
		loadSurveyByIdRepositoryStub
	}
}

describe('DbLoadSurveyById', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveyByIdRepository', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
		await sut.loadById('any-id')
		expect(loadByIdSpy).toHaveBeenCalledWith('any-id')
	})

	test('Should return survey on success', async () => {
		const { sut } = makeSut()
		const survey = await sut.loadById('any-id')
		expect(survey).toEqual(mockFakeSurvey())
	})

	test('Should throw if LoadSurveyByIdRepository throws', async () => {
		const { sut,loadSurveyByIdRepositoryStub } = makeSut()
		jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
		const promise = sut.loadById('any-id')
		await expect(promise).rejects.toThrow()
	})
})

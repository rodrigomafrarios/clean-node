import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import MockDate from 'mockdate'
import { throwError, mockFakeSurveys } from '@/tests/domain/mocks'
import { mockLoadSurveysRepository } from '@/tests/data/mocks'

interface SutTypes {
	sut: DbLoadSurveys
	loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
	const loadSurveysRepositoryStub = mockLoadSurveysRepository()
	const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
	return {
		sut,
		loadSurveysRepositoryStub
	}
}

describe('DbLoadSurveys', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveysRepository', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut()
		const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
		await sut.load()
		expect(loadAllSpy).toHaveBeenCalledWith()
	})
	test('Should return a list of surveys on success', async () => {
		const { sut } = makeSut()
		const surveys = await sut.load()
		expect(surveys).toEqual(mockFakeSurveys())
	})
	test('Should throw if LoadSurveysRepository throws', async () => {
		const { sut,loadSurveysRepositoryStub } = makeSut()
		jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
		const promise = sut.load()
		await expect(promise).rejects.toThrow()
	})
})

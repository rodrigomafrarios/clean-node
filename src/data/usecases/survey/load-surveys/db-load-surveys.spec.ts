import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import MockDate from 'mockdate'

interface SutTypes {
	sut: DbLoadSurveys
	loadSurveysRepositoryStub: LoadSurveysRepository
}
const makeFakeSurveys = (): SurveyModel[] => {
	return [{
		id: 'any_id',
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: ''
		}],
		date: new Date()
	}]
}
const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
	class LoadSurveysRepositoryStub implements LoadSurveysRepository {
		async loadAll (): Promise<SurveyModel[]> {
			return new Promise(resolve => resolve(makeFakeSurveys()))
		}
	}
	return new LoadSurveysRepositoryStub()
}
const makeSut = (): SutTypes => {
	const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
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
		expect(surveys).toEqual(makeFakeSurveys())
	})
	test('Should throw if LoadSurveysRepository throws', async () => {
		const { sut,loadSurveysRepositoryStub } = makeSut()
		jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const promise = sut.load()
		await expect(promise).rejects.toThrow()
	})
})

import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from './db-load-survey-by-id'

const makeFakeSurvey = (): SurveyModel => {
	return {
		id: 'any_id',
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: 'any-answer'
		}],
		date: new Date()
	}
}

type SutTypes = {
	sut: DbLoadSurveyById
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
	class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
		async loadById (id: string): Promise<SurveyModel> {
			return new Promise(resolve => resolve(makeFakeSurvey()))
		}
	}
	return new LoadSurveyByIdRepositoryStub()
}
const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
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
		expect(survey).toEqual(makeFakeSurvey())
	})

	test('Should throw if LoadSurveyByIdRepository throws', async () => {
		const { sut,loadSurveyByIdRepositoryStub } = makeSut()
		jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const promise = sut.loadById('any-id')
		await expect(promise).rejects.toThrow()
	})
})

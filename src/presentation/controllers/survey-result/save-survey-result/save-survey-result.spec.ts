import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-protocols.'

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
}

const makeFakeRequest = (): HttpRequest => ({
	params: {
		survey: 'any_id'
	}
})

const makeFakeSurvey = (): SurveyModel => ({
	id: 'any_id',
	question: 'any_question',
	answers: [{
		image: 'any_image',
		answer: 'any-answer'
	}],
	date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
	class LoadSurveyByIdStub implements LoadSurveyById {
		async loadById (id: string): Promise<SurveyModel> {
			return new Promise(resolve => resolve(makeFakeSurvey()))
		}
	}
	return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = makeLoadSurveyById()
	const sut = new SaveSurveyResultController(loadSurveyByIdStub)
	return {
		sut,
		loadSurveyByIdStub
	}
}

describe('SaveSurveyResult Controller', () => {
	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
		await sut.handle(makeFakeRequest())
		expect(loadSpy).toHaveBeenCalledWith('any_id')
	})
})

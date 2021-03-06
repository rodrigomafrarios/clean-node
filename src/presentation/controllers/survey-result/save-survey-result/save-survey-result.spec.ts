import { forbidden, InvalidParamError } from '../../survey/add-survey/add-survey-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-protocols.'

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
}

const makeFakeRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any_id'
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

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
		const httpResponse = await sut.handle(makeFakeRequest())
		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})
})
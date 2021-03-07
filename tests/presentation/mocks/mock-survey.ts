import { LoadSurveys, SurveyModel } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockAddSurvey = (): AddSurvey => {
	class AddSurveyStub implements AddSurvey {
		async add (data: AddSurveyParams): Promise<void> {
			return Promise.resolve()
		}
	}
	return new AddSurveyStub()
}

export const mockFakeSurveys = (): SurveyModel[] => {
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

export const mockLoadSurveys = (): LoadSurveys => {
	class LoadSurveysStub implements LoadSurveys {
		async load (): Promise<SurveyModel[]> {
			return Promise.resolve(mockFakeSurveys())
		}
	}
	return new LoadSurveysStub()
}

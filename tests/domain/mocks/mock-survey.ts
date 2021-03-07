import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-survey-result-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/data/usecases/survey/add-survey/add-survey-protocols'

const date = new Date()

export const mockFakeSurvey = (): SurveyModel => {
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

export const mockFakeSurveyResultParams = (): SaveSurveyResultParams => ({
	accountId: 'any-account-id',
	surveyId: 'any-survey-id',
	answer: 'any-answer',
	date: new Date()
})

export const mockFakeSurveyResultModel = (): SurveyResultModel => Object.assign({}, mockFakeSurveyResultParams(), { id: 'any-id' })

export const mockFakeSurveyData = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
	}],
	date: date
})

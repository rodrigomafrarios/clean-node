import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-survey-result-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/data/usecases/survey/add-survey/add-survey-protocols'

export const mockFakeSurvey = (): SurveyModel => {
	return {
		id: 'any_survey_id',
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: 'any_answer'
		},
		{
			image: 'other_image',
			answer: 'other_answer'
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
	surveyId: 'any-survey-id',
	accountId: 'any-account-id',
	answer: 'any-answer',
	date: new Date()
})

export const mockFakeSurveyResultModel = (): SurveyResultModel => ({
	surveyId: 'any_survey_id',
	question: 'any_question',
	answers: [{
		image: 'any_image',
		answer: 'any_answer',
		count: 0,
		percent: 0
	},
	{
		image: 'other_image',
		answer: 'other_answer',
		count: 0,
		percent: 0
	}],
	date: new Date()
})

export const mockFakeSurveyData = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
	}],
	date: new Date()
})

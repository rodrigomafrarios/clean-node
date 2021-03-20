import {
	accountSchema,
	loginParamsSchema,
	errorSchema,
	surveySchema,
	surveysSchema,
	surveyAnswerSchema,
	signupParamsSchema,
	addSurveyParamsSchema,
	saveSurveyParamsSchema,
	surveyResultSchema,
	surveyResultAnswerSchema
} from './schemas/index'

export default {
	account: accountSchema,
	login: loginParamsSchema,
	error: errorSchema,
	survey: surveySchema,
	surveys: surveysSchema,
	surveyAnswer: surveyAnswerSchema,
	signUpParams: signupParamsSchema,
	addSurveyParams: addSurveyParamsSchema,
	saveSurveyParams: saveSurveyParamsSchema,
	surveyResult: surveyResultSchema,
	surveyResultAnswer: surveyResultAnswerSchema
}

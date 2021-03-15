import { loginPath, surveyPath, signUpPath, surveyResultPath } from './paths/index'

export default {
	'/login': loginPath,
	'/signup': signUpPath,
	'/surveys': surveyPath,
	'/surveys/{surveyId}/results': surveyResultPath
}

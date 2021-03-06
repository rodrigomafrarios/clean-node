import { forbidden, InvalidParamError, serverError } from '../../survey/add-survey/add-survey-controller-protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-protocols.'

export class SaveSurveyResultController implements Controller {
	constructor (private readonly loadSurveyById: LoadSurveyById) {}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { params } = httpRequest
			const survey = await this.loadSurveyById.loadById(params.surveyId)
			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'))
			}
			return null
		} catch (error) {
			return serverError(error)
		}
	}
}

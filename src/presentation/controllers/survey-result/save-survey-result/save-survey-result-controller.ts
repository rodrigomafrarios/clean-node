import { forbidden, InvalidParamError, serverError } from '../../survey/add-survey/add-survey-controller-protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-protocols.'

export class SaveSurveyResultController implements Controller {
	constructor (private readonly loadSurveyById: LoadSurveyById) {}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { params, body } = httpRequest
			const survey = await this.loadSurveyById.loadById(params.surveyId)
			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'))
			}

			const answers = survey.answers.map(a => a.answer)
			if (!answers.includes(body.answer)) {
				return forbidden(new InvalidParamError('answer'))
			}
			return null
		} catch (error) {
			return serverError(error)
		}
	}
}

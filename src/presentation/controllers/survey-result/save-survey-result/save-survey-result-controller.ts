import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-protocols.'

export class SaveSurveyResultController implements Controller {
	constructor (private readonly loadSurveyById: LoadSurveyById) {}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const { params } = httpRequest
		await this.loadSurveyById.loadById(params.survey)
		return null
	}
}

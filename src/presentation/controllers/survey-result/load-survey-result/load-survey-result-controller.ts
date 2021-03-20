import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
	constructor (private readonly loadSurveyById: LoadSurveyById) {}
	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const { params } = httpRequest
		await this.loadSurveyById.loadById(params.surveyId)
		return Promise.resolve(null)
	}
}

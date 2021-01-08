import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'
import { ok } from '../../../../presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
	private readonly loadSurveys: LoadSurveys
	constructor (loadSurveys: LoadSurveys) {
		this.loadSurveys = loadSurveys
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const surveys = await this.loadSurveys.load()
		return ok(surveys)
	}
}

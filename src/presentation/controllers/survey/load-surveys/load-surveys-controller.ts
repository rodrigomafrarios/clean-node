import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
	private readonly loadSurveys: LoadSurveys
	constructor (loadSurveys: LoadSurveys) {
		this.loadSurveys = loadSurveys
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const surveys = await this.loadSurveys.load()
			if (!surveys.length) {
				return noContent()
			}
			return ok(surveys)
		} catch (error) {
			return serverError(error)
		}
	}
}

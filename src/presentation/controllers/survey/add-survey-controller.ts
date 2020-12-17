import { Controller, HttpRequest, HttpResponse, Validation, badRequest } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
	private readonly validation: Validation
	constructor (validation: Validation) {
		this.validation = validation
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const error = await this.validation.validate(httpRequest.body)
		if (error) {
			return badRequest(error)
		}
		return new Promise(resolve => resolve(null))
	}
}

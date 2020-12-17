import { Controller, HttpRequest, HttpResponse, Validation, badRequest, serverError, AddSurvey, noContent } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
	private readonly validation: Validation
	private readonly addSurvey: AddSurvey
	constructor (validation: Validation, addSurvey: AddSurvey) {
		this.validation = validation
		this.addSurvey = addSurvey
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = await this.validation.validate(httpRequest.body)
			if (error) {
				return badRequest(error)
			}
			const { question, answers } = httpRequest.body
			await this.addSurvey.add({
				question,
				answers
			})
			return noContent()
		} catch (error) {
			return serverError(error)
		}
	}
}

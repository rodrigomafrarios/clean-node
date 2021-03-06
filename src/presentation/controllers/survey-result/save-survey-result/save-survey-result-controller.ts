import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import {
	Controller,
	HttpRequest,
	HttpResponse,
	LoadSurveyById
} from './save-survey-result-protocols.'

export class SaveSurveyResultController implements Controller {
	constructor (
		private readonly loadSurveyById: LoadSurveyById,
		private readonly saveSurveyResult: SaveSurveyResult) {}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { params, body, accountId } = httpRequest
			const survey = await this.loadSurveyById.loadById(params.surveyId)
			if (!survey) {
				return forbidden(new InvalidParamError('surveyId'))
			}

			const answers = survey.answers.map(a => a.answer)
			if (!answers.includes(body.answer)) {
				return forbidden(new InvalidParamError('answer'))
			}

			const saveResult = await this.saveSurveyResult.save({
				accountId,
				surveyId: params.surveyId,
				answer: body.answer,
				date: new Date()
			})
			return ok(saveResult)
		} catch (error) {
			return serverError(error)
		}
	}
}

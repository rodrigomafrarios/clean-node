import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { LoadSurveysRepository } from '../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'

export class DbLoadSurveys implements LoadSurveys {
	private readonly loadSurveysRepository: LoadSurveysRepository
	constructor (loadSurveysRepository: LoadSurveysRepository) {
		this.loadSurveysRepository = loadSurveysRepository
	}

	async load (): Promise<SurveyModel[]> {
		const surveys = await this.loadSurveysRepository.loadAll()
		return surveys
	}
}

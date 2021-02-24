import { LoadSurveys, LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

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

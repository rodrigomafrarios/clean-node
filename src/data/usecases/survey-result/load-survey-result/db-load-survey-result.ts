import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResultRepository implements LoadSurveyResult {
	async load (surveyId: string): Promise<SurveyResultModel> {
		return null
	}
}

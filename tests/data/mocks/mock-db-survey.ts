import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '@/data/usecases/survey/add-survey/add-survey-protocols'
import { mockFakeSurvey, mockFakeSurveyResultModel, mockFakeSurveys } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository, SurveyModel } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-survey-result-protocols'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
	class AddSurveyRepositoryStub implements AddSurveyRepository {
			async add (surveyData: AddSurveyParams): Promise<void> {
					return Promise.resolve()
			}
	}
	return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
	class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
		async loadById (id: string): Promise<SurveyModel> {
			return Promise.resolve(mockFakeSurvey())
		}
	}
	return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
	class LoadSurveysRepositoryStub implements LoadSurveysRepository {
		async loadAll (): Promise<SurveyModel[]> {
			return Promise.resolve(mockFakeSurveys())
		}
	}
	return new LoadSurveysRepositoryStub()
}

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
	class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
			async save (data: SaveSurveyResultParams): Promise<void> {}
	}
	return new SaveSurveyResultRepositoryStub()
}

export const makeLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
	class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
		async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
			return Promise.resolve(mockFakeSurveyResultModel())
		}
	}
	return new LoadSurveyResultRepositoryStub()
}

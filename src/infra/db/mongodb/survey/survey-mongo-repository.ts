import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
	async add (surveyData: AddSurveyModel): Promise<void> {
		const collection = await MongoHelper.getCollection('surveys')
		await collection.insertOne(surveyData)
	}

	async loadAll (): Promise<SurveyModel[]> {
		const collection = await MongoHelper.getCollection('surveys')
		const surveys = await collection.find().toArray()
		return surveys
	}
}

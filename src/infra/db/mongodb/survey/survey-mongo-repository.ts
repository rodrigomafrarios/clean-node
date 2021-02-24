import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
	async add (surveyData: AddSurveyModel): Promise<void> {
		const collection = await MongoHelper.getCollection('surveys')
		await collection.insertOne(surveyData)
	}

	async loadAll (): Promise<SurveyModel[]> {
		const collection = await MongoHelper.getCollection('surveys')
		const surveys = await collection.find().toArray()
		return surveys
	}

	async loadById (id: string): Promise<SurveyModel> {
		const collection = await MongoHelper.getCollection('surveys')
		const survey = await collection.findOne({ _id: id })
		return survey
	}
}

import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
	return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
	const response = await surveyCollection.insertOne({
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: 'any_answer'
		}, {
			answer: 'other_answer'
		}],
		date: new Date()
	})
	return response.ops[0]
}

const makeAccount = async (): Promise<AccountModel> => {
	const response = await accountCollection.insertOne({
		name: 'any_name',
		email: 'any_mail@mail.com',
		password: 'any_password'
	})
	return response.ops[0]
}
describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})
	afterAll(async () => {
		await MongoHelper.disconnect()
	})
	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys')
		await surveyCollection.deleteMany({})

		surveyResultCollection = await MongoHelper.getCollection('surveysResults')
		await surveyResultCollection.deleteMany({})

		accountCollection = await MongoHelper.getCollection('account')
		await accountCollection.deleteMany({})
	})

	describe('save()', () => {
		test('Should add a survey result if its new', async () => {
			const survey = await makeSurvey()
			const account = await makeAccount()
			const sut = makeSut()
			const surveyResult = await sut.save({
				surveyId: survey.id,
				accountId: account.id,
				answer: survey.answers[0].answer,
				date: new Date()
			})
			expect(surveyResult).toBeTruthy()
			expect(surveyResult.id).toBeTruthy()
			expect(surveyResult.answer).toBe(survey.answers[0].answer)
		})
	})
})

import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { SurveyModel } from '@/domain/models/survey'

let collection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
	const account = await accountCollection.insertOne({
		name: 'Rodrigp',
		email: 'rodrigomafrarios@gmail.com',
		password: '123'
	})
	const id = account.ops[0]._id
	const accessToken = sign({ id }, env.jwtSecret)
	await accountCollection.updateOne({
		_id: id
	}, {
		$set: {
			accessToken
		}
	})
	return accessToken
}

const makeFakeSurvey = async (): Promise<SurveyModel> => {
	const response = await collection.insertOne({
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: 'any_answer'
		}, {
			answer: 'other_answer'
		}],
		date: new Date()
	})
	const survey = Object.assign({}, response.ops[0], { id: response.ops[0]._id })
	return survey
}

beforeAll(async () => {
	await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
	await MongoHelper.disconnect()
})

beforeEach(async () => {
	collection = await MongoHelper.getCollection('surveys')
	await collection.deleteMany({})
	accountCollection = await MongoHelper.getCollection('accounts')
	await accountCollection.deleteMany({})
})

describe('PUT /surveys/:surveyId/results', () => {
	test('Should return 403 on save survey result without accessToken', async () => {
		await request(app)
		.put('/api/surveys/any_id/results')
		.send({
			answer: 'any-answer'
		})
		.expect(403)
	})

	test('Should return 200 on save survey result with valid accessToken', async () => {
		const { id } = await makeFakeSurvey()
		const accessToken = await makeAccessToken()
		await request(app)
		.put(`/api/surveys/${id}/results`)
		.set('x-access-token', accessToken)
		.send({
			answer: 'any_answer'
		})
		.expect(200)
	})
})

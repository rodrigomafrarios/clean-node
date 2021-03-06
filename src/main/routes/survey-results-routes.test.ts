import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

beforeAll(async () => {
	await MongoHelper.connect(process.env.MONGO_URL)
})
afterAll(async () => {
	await MongoHelper.disconnect()
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
})

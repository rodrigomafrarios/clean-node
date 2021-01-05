import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let collection: Collection

beforeAll(async () => {
	await MongoHelper.connect('mongodb://0.0.0.0:27017/jest')
})
afterAll(async () => {
	await MongoHelper.disconnect()
})
beforeEach(async () => {
	collection = await MongoHelper.getCollection('surveys')
	await collection.deleteMany({})
})

describe('POST /surveys', () => {
	test('Should return 403 on add survey without accessToken', async () => {
		await request(app)
		.post('/api/surveys')
		.send({
			question: 'Question',
			answers: [{
				answer: 'answer1',
				image: 'image1'
			},
			{
				answer: 'answer2',
				image: 'image2'
			}]
		})
		.expect(403)
	})
})

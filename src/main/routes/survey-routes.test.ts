import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let collection: Collection
let accountCollection: Collection

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
			}],
			date: new Date()
		})
		.expect(403)
	})
	test('Should return 204 on add survey with valid accessToken', async () => {
		const account = await accountCollection.insertOne({
			name: 'Rodrigp',
			email: 'rodrigomafrarios@gmail.com',
			password: '123',
			role: 'admin'
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
		await request(app)
		.post('/api/surveys')
		.set('x-access-token', accessToken)
		.send({
			question: 'Question',
			answers: [{
				answer: 'answer1',
				image: 'image1'
			},
			{
				answer: 'answer2',
				image: 'image2'
			}],
			date: new Date()
		})
		.expect(204)
	})
})
describe('GET /surveys', () => {
	test('Should return 403 on load surveys without accessToken', async () => {
		await request(app)
		.get('/api/surveys')
		.expect(403)
	})
})

import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let collection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
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
	return accessToken
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
		await request(app)
		.post('/api/surveys')
		.set('x-access-token', await makeAccessToken())
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
	test('Should return 204 on load surveys with valid accessToken', async () => {
		await request(app)
		.get('/api/surveys')
		.set('x-access-token', await makeAccessToken())
		.expect(204)
	})
	test('Should return 200 on load surveys', async () => {
		await collection.insertMany([{
			question: 'any_question',
			answers: [{
				image: 'any_image',
				answer: 'any_answer'
			}, {
				answer: 'other_answer'
			}],
			date: new Date()
		},
		{
			question: 'any1_question',
			answers: [{
				image: 'any1_image',
				answer: 'any1_answer'
			}, {
				answer: 'other1_answer'
			}],
			date: new Date()
		}])
		await request(app)
		.get('/api/surveys')
		.set('x-access-token', await makeAccessToken())
		.expect(200)
	})
})

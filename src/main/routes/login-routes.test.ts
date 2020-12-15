import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
let collection: Collection

beforeAll(async () => {
	await MongoHelper.connect('mongodb://0.0.0.0:27017/jest')
})
afterAll(async () => {
	await MongoHelper.disconnect()
})
beforeEach(async () => {
	collection = await MongoHelper.getCollection('accounts')
	await collection.deleteMany({})
})

describe('POST /signup', () => {
	test('Should return 200 on signup', async () => {
		await request(app)
		.post('/api/signup')
		.send({
			name: 'Rodrigp',
			email: 'rodrigomafrarios@gmail.com',
			password: '123',
			passwordConfirmation: '123'
		})
		.expect(200)
	})
})
describe('POST /login', () => {
	test('Should return 200 on login', async () => {
		const password = await hash('123',12)
		await collection.insertOne({
			name: 'Rodrigp',
			email: 'rodrigomafrarios@gmail.com',
			password
		})
		await request(app)
		.post('/api/login')
		.send({
			email: 'rodrigomafrarios@gmail.com',
			password: '123'
		})
		.expect(200)
	})
})

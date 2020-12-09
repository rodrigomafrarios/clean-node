import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Signup routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect('mongodb://0.0.0.0:27017/jest')
	})
	afterAll(async () => {
		await MongoHelper.disconnect()
	})
	beforeEach(async () => {
		const collection = await MongoHelper.getCollection('accounts')
		await collection.deleteMany({})
	})
	test('Should return an account on success', async () => {
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

import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-mongo-repository'
describe('Log Mongo Repository', () => {
	let collection: Collection

	beforeAll(async () => {
		await MongoHelper.connect('mongodb://0.0.0.0:27017/jest')
	})
	afterAll(async () => {
		await MongoHelper.disconnect()
	})
	beforeEach(async () => {
		collection = await MongoHelper.getCollection('errors')
		await collection.deleteMany({})
	})
	test('Should create an error log on success', async () => {
		const sut = new LogMongoRepository()
		await sut.logError('any_error')
		const count = await collection.countDocuments()
		expect(count).toBe(1)
	})
})

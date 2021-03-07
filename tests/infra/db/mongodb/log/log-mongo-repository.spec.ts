import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
describe('Log Mongo Repository', () => {
	let collection: Collection

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
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

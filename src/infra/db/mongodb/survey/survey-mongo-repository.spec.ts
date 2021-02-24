import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

let collection: Collection

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})
	afterAll(async () => {
		await MongoHelper.disconnect()
	})
	beforeEach(async () => {
		collection = await MongoHelper.getCollection('surveys')
		await collection.deleteMany({})
	})

	const makeSut = (): SurveyMongoRepository => {
		return new SurveyMongoRepository()
	}
	describe('add()', () => {
		test('Should add a survey on success', async () => {
			const sut = makeSut()
			await sut.add({
				question: 'any_question',
				answers: [{
					image: 'any_image',
					answer: 'any_answer'
				}, {
					answer: 'other_answer'
				}],
				date: new Date()
			})
			const survey = await collection.findOne({ question: 'any_question' })
			expect(survey).toBeTruthy()
		})
	})
	describe('loadAll()', () => {
		test('Should loadAll surveys on success', async () => {
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
			const sut = makeSut()
			const surveys = await sut.loadAll()
			expect(surveys.length).toBe(2)
			expect(surveys[0].id).toBeTruthy()
			expect(surveys[0].question).toBe('any_question')
			expect(surveys[1].question).toBe('any1_question')
		})
		test('Should loadAll empty list', async () => {
			const sut = makeSut()
			const surveys = await sut.loadAll()
			expect(surveys.length).toBe(0)
		})
	})
	describe('loadById()', () => {
		test('Should load survey by id on success', async () => {
			const response = await collection.insertMany([{
				question: 'any_question',
				answers: [{
					image: 'any_image',
					answer: 'any_answer'
				}, {
					answer: 'other_answer'
				}],
				date: new Date()
			}])
			const id = response.ops[0]._id
			const sut = makeSut()
			const survey = await sut.loadById(id)
			expect(survey).toBeTruthy()
			expect(survey.id).toBeTruthy()
		})
	})
})

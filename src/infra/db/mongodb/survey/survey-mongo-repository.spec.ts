import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'

let collection: Collection

describe('Account Mongo Repository', () => {
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
	const makeSut = (): SurveyMongoRepository => {
		return new SurveyMongoRepository()
    }
    test('Should add a survey on success', async () => {
        const sut = makeSut()
        await sut.add({
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer: 'any_answer'
            }, {
                answer: 'other_answer'
            }]
        })
        const survey = await collection.findOne({ question: 'any_question' })
        expect(survey).toBeTruthy()
    })
})

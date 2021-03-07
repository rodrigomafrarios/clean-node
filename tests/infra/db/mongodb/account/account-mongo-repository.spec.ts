import { Collection } from 'mongodb'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

let collection: Collection

const mockAddAccountParams = (): AddAccountParams => ({
	name: 'any_name',
	email: 'any_mail@mail.com',
	password: 'any_password'
})

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})
	afterAll(async () => {
		await MongoHelper.disconnect()
	})
	beforeEach(async () => {
		collection = await MongoHelper.getCollection('accounts')
		await collection.deleteMany({})
	})
	const makeSut = (): AccountMongoRepository => {
		return new AccountMongoRepository()
	}

	describe('add()', async () => {
		const sut = makeSut()
		const account = await sut.add(mockAddAccountParams())
		expect(account).toBeTruthy()
		expect(account.id).toBeTruthy()
		expect(account.name).toBe('any_name')
		expect(account.email).toBe('any_mail@mail.com')
		expect(account.password).toBe('any_password')
	})
	describe('loadByEmail()', () => {
		test('Should return an account on loadByEmail success', async () => {
			const sut = makeSut()
			await collection.insertOne(mockAddAccountParams())
			const account = await sut.loadByEmail('any_mail@mail.com')
			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe('any_name')
			expect(account.email).toBe('any_mail@mail.com')
			expect(account.password).toBe('any_password')
		})
		test('Should return null if loadByEmail fails', async () => {
			const sut = makeSut()
			const account = await sut.loadByEmail('any_mail@mail.com')
			expect(account).toBeFalsy()
		})
	})
	describe('updateAccessToken()', () => {
		test('Should update the account accessToken on updateAccessToken success', async () => {
			const sut = makeSut()
			const result = await collection.insertOne(mockAddAccountParams())
			const fakeAccount = result.ops[0]
			expect(result.ops[0].accessToken).toBeFalsy()
			await sut.updateAccessToken(fakeAccount._id,'any_token')
			const account = await collection.findOne({ _id: fakeAccount._id })
			expect(account).toBeTruthy()
			expect(account.accessToken).toBe('any_token')
		})
	})
	describe('loadByToken()', () => {
		test('Should return an account on loadByToken without role', async () => {
			const sut = makeSut()
			const addAccountParams = Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token' })
			await collection.insertOne(addAccountParams)
			const account = await sut.loadByToken('any_token')
			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe('any_name')
			expect(account.email).toBe('any_mail@mail.com')
			expect(account.password).toBe('any_password')
		})
		test('Should return an account on loadByToken with if user is admin', async () => {
			const sut = makeSut()
			const addAccountParams = Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token', role: 'admin' })
			await collection.insertOne(addAccountParams)
			const account = await sut.loadByToken('any_token')
			expect(account).toBeTruthy()
			expect(account.id).toBeTruthy()
			expect(account.name).toBe('any_name')
			expect(account.email).toBe('any_mail@mail.com')
			expect(account.password).toBe('any_password')
		})
		test('Should return null on loadByToken with invalid role', async () => {
			const sut = makeSut()
			const addAccountParams = Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token' })
			await collection.insertOne(addAccountParams)
			const account = await sut.loadByToken('any_token', 'admin')
			expect(account).toBeFalsy()
		})
		test('Should return null if loadByToken fails', async () => {
			const sut = makeSut()
			const account = await sut.loadByToken('any_token')
			expect(account).toBeFalsy()
		})
	})
})

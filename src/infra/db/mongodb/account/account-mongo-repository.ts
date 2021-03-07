import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AddAccountParams } from '../../../../domain/usecases/account/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
	async add (accountData: AddAccountParams): Promise<AccountModel> {
		const collection = await MongoHelper.getCollection('accounts')
		const result = await collection.insertOne(accountData)
		return MongoHelper.map(result.ops[0])
	}

	async loadByEmail (email: string): Promise<AccountModel> {
		const collection = await MongoHelper.getCollection('accounts')
		const account = await collection.findOne({ email })
		return account && MongoHelper.map(account)
	}

	async updateAccessToken (id: string, token: string): Promise<void> {
		const collection = await MongoHelper.getCollection('accounts')
		await collection.updateOne({
			_id: id
		},
		{
			$set: {
				accessToken: token
			}
		})
	}

	async loadByToken (token: string, role?: string): Promise<AccountModel> {
		const collection = await MongoHelper.getCollection('accounts')
		const account = await collection.findOne({
			accessToken: token,
			$or: [{
				role
			}, {
				role: 'admin'
			}]
		})
		return account && MongoHelper.map(account)
	}
}

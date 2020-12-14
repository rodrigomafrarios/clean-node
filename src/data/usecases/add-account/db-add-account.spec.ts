import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
	sut: DbAddAccount
	hasherStub: Hasher
	addAccountRepositoryStub: AddAccountRepository
}

const factoryHasher = (): Hasher => {
	class HasherStub {
		async hash (value: string): Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		}
	}
	return new HasherStub()
}
const factoryAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add (accountData: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email@mail.com',
				password: 'hashed_password'
			}
			return new Promise(resolve => resolve(fakeAccount))
		}
	}
	return new AddAccountRepositoryStub()
}

const factory = (): SutTypes => {
	const addAccountRepositoryStub = factoryAddAccountRepository()
	const hasherStub = factoryHasher()
	const sut = new DbAddAccount(hasherStub,addAccountRepositoryStub)
	return {
		sut,
		hasherStub,
		addAccountRepositoryStub
	}
}
describe('DbAddAccount Usecase', () => {
	test('Should call Hasher with correct password', async () => {
		const { sut, hasherStub } = factory()
		const hashSpy = jest.spyOn(hasherStub, 'hash')
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password'
		}
		await sut.add(accountData)
		expect(hashSpy).toHaveBeenCalledWith('valid_password')
	})
	test('Should throw if Hasher throws', async () => {
		const { sut, hasherStub } = factory()
		jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => {
			reject(new Error())
		}))
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password'
		}
		const promise = sut.add(accountData)
		await expect(promise).rejects.toThrow()
	})
	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = factory()
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password'
		}
		await sut.add(accountData)
		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'hashed_password'
		})
	})
	test('Should throw if AddAccountRepository throws', async () => {
		const { sut, addAccountRepositoryStub } = factory()
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
			reject(new Error())
		}))
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password'
		}
		const promise = sut.add(accountData)
		await expect(promise).rejects.toThrow()
	})
	test('Should return an account on success', async () => {
		const { sut } = factory()
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password'
		}
		const account = await sut.add(accountData)
		expect(account).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'hashed_password'
		})
	})
})

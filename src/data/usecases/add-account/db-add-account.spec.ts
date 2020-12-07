import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
	sut: DbAddAccount
	encrypterStub: Encrypter
	addAccountRepositoryStub: AddAccountRepository
}

const factoryEncrypter = (): Encrypter => {
	class EncrypterStub {
		async encrypt (value: string): Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		}
	}
	return new EncrypterStub()
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
	const encrypterStub = factoryEncrypter()
	const sut = new DbAddAccount(encrypterStub,addAccountRepositoryStub)
	return {
		sut,
		encrypterStub,
		addAccountRepositoryStub
	}
}
describe('DbAddAccount Usecase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = factory()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'valid_password'
		}
		await sut.add(accountData)
		expect(encryptSpy).toHaveBeenCalledWith('valid_password')
	})
	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = factory()
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
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
})

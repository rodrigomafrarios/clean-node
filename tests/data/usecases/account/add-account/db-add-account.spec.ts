import { Hasher, AccountModel, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/tests/domain/mocks'
import { mockHasher, mockAddAccountRepository } from '@/tests/data/mocks'

interface SutTypes {
	sut: DbAddAccount
	hasherStub: Hasher
	addAccountRepositoryStub: AddAccountRepository
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const mockLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail (email: string): Promise<AccountModel> {
			return Promise.resolve(null)
		}
	}
	return new LoadAccountByEmailRepositoryStub()
}

const factory = (): SutTypes => {
	const addAccountRepositoryStub = mockAddAccountRepository()
	const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepositoryStub()
	const hasherStub = mockHasher()
	const sut = new DbAddAccount(hasherStub,addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
	return {
		sut,
		hasherStub,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub
	}
}
describe('DbAddAccount Usecase', () => {
	test('Should call Hasher with correct password', async () => {
		const { sut, hasherStub } = factory()
		const hashSpy = jest.spyOn(hasherStub, 'hash')
		await sut.add(mockAddAccountParams())
		expect(hashSpy).toHaveBeenCalledWith('hashed_password')
	})
	test('Should throw if Hasher throws', async () => {
		const { sut, hasherStub } = factory()
		jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
		const promise = sut.add(mockAddAccountParams())
		await expect(promise).rejects.toThrow()
	})
	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = factory()
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
		await sut.add(mockAddAccountParams())
		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@mail.com',
			password: 'any_password'
		})
	})
	test('Should throw if AddAccountRepository throws', async () => {
		const { sut, addAccountRepositoryStub } = factory()
		jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
		const promise = sut.add(mockAddAccountParams())
		await expect(promise).rejects.toThrow()
	})
	test('Should return an account on success', async () => {
		const { sut } = factory()
		const account = await sut.add(mockAddAccountParams())
		expect(account).toEqual(mockAccountModel())
	})
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = factory()
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
		await sut.add(mockAccountModel())
		expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
	})
	test('Should return null if LoadAccountByEmailRepository not return null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = factory()
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
		const account = await sut.add(mockAccountModel())
		expect(account).toBeNull()
	})
})

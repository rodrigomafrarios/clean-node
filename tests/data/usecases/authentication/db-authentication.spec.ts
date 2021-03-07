import {
	LoadAccountByEmailRepository,
	HashComparer,
	Encrypter,
	UpdateAccessTokenRepository
} from '@/data/usecases/authentication/db-authentication-protocols'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import { throwError, mockFakeAuthentication } from '@/tests/domain/mocks'
import { mockHashComparer, mockEncrypter, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/tests/data/mocks'
interface SutTypes {
	sut: DbAuthentication
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
	hashComparerStub: HashComparer
	encrypterStub: Encrypter
	updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
	const hashComparerStub = mockHashComparer()
	const encrypterStub = mockEncrypter()
	const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub
	}
}
describe('DbAuthentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
		await sut.auth(mockFakeAuthentication())
		expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
	})
	test('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
		const promise = sut.auth(mockFakeAuthentication())
		await expect(promise).rejects.toThrow()
	})
	test('Should return null if LoadAccountByEmailRepository returns null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
		const accessToken = await sut.auth(mockFakeAuthentication())
		expect(accessToken).toBeNull()
	})
	test('Should call HashComparer with correct password', async () => {
		const { sut, hashComparerStub } = makeSut()
		const compareSpy = jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(null)
		await sut.auth(mockFakeAuthentication())
		expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
	})
	test('Should throw if HashComparer throws', async () => {
		const { sut, hashComparerStub } = makeSut()
		jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
		const promise = sut.auth(mockFakeAuthentication())
		await expect(promise).rejects.toThrow()
	})
	test('Should return null if HashComparer returns false', async () => {
		const { sut, hashComparerStub } = makeSut()
		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
		const accessToken = await sut.auth(mockFakeAuthentication())
		expect(accessToken).toBeNull()
	})
	test('Should call Encrypter with correct id', async () => {
		const { sut, encrypterStub } = makeSut()
		const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
		await sut.auth(mockFakeAuthentication())
		expect(generateSpy).toHaveBeenCalledWith('any_id')
	})
	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut()
		jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
		const promise = sut.auth(mockFakeAuthentication())
		await expect(promise).rejects.toThrow()
	})
	test('Should call Encrypter with correct id', async () => {
		const { sut } = makeSut()
		const accessToken = await sut.auth(mockFakeAuthentication())
		expect(accessToken).toBe('any_token')
	})
	test('Should call UpdateAccessTokenRepository with correct values', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut()
		const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
		await sut.auth(mockFakeAuthentication())
		expect(updateSpy).toHaveBeenCalledWith('any_id','any_token')
	})
	test('Should throw if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut()
		jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
		const promise = sut.auth(mockFakeAuthentication())
		await expect(promise).rejects.toThrow()
	})
})

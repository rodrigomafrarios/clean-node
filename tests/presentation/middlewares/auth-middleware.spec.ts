import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { LoadAccountByToken, HttpRequest, AccountModel } from '@/presentation/middlewares/auth-middleware-protocols'
import { mockAccountModel, throwError } from '@/tests/domain/mocks'

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByToken: LoadAccountByToken
}

const makeFakeRequest = (): HttpRequest => ({
	headers: {
		'x-access-token': 'any_token'
	}
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load (accessToken: string, role?: string): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel())
        }
    }
    return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByToken = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByToken, role)
    return {
        sut,
        loadAccountByToken
    }
}

describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })
    test('Should call LoadAccountByToken with correct accessToken', async () => {
        const role = 'any_role'
        const { sut, loadAccountByToken } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByToken, 'load')
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token', role)
	})
	test('Should return 403 if LoadAccountByToken returns null', async () => {
		const { sut, loadAccountByToken } = makeSut()
		jest.spyOn(loadAccountByToken, 'load').mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
	})
	test('Should return 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
	})
	test('Should return 500 if LoadAccountByToken throws', async () => {
        const { sut, loadAccountByToken } = makeSut()
		jest.spyOn(loadAccountByToken, 'load').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
	})
})

import { mockAccountModel } from '@/tests/domain/mocks'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AddAccountParams, LoadAccountByEmailRepository } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AccountModel, UpdateAccessTokenRepository } from '@/data/usecases/authentication/db-authentication-protocols'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export const mockAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
			return Promise.resolve(mockAccountModel())
		}
	}
	return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail (email: string): Promise<AccountModel> {
			return Promise.resolve(mockAccountModel())
		}
	}
	return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
	class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
			async loadByToken (token: string, role?: string): Promise<AccountModel> {
					return Promise.resolve(mockAccountModel())
			}
	}
	return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
	class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
		async updateAccessToken (id: string, token: string): Promise<void> {
			return Promise.resolve()
		}
	}
	return new UpdateAccessTokenRepositoryStub()
}

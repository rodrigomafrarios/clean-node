import { AuthenticationParams } from '@/data/usecases/authentication/db-authentication-protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAccountModel = (): AccountModel => ({
	id: 'any_id',
	name: 'valid_name',
	email: 'valid_email@mail.com',
	password: 'hashed_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
	name: 'valid_name',
	email: 'valid_email@mail.com',
	password: 'hashed_password'
})

export const mockFakeAuthentication = (): AuthenticationParams => ({
	email: 'any_mail@mail.com',
	password: 'any_password'
})

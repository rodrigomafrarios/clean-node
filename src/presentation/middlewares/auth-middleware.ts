import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
export class AuthMiddleware implements Middleware {
	private readonly loadAccountByToken
	private readonly role
    constructor (loadAccountByToken: LoadAccountByToken, role?: string) {
		this.loadAccountByToken = loadAccountByToken
		this.role = role
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const accessToken = httpRequest.headers?.['x-access-token']
			if (accessToken) {
				const account = await this.loadAccountByToken.load(accessToken, this.role)
				if (account) {
					return ok({ accountId: account.id })
				}
			}
			return forbidden(new AccessDeniedError())
		} catch (error) {
			return serverError(error)
		}
    }
}

import { forbidden } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
export class AuthMiddleware implements Middleware {
    private readonly loadAccountByToken
    constructor (loadAccountByToken: LoadAccountByToken) {
        this.loadAccountByToken = loadAccountByToken
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.['x-access-token']
        if (accessToken) {
            await this.loadAccountByToken.load(accessToken)
        }
        return forbidden(new AccessDeniedError())
    }
}

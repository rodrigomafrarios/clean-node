import { forbidden } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
    }
}

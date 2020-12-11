import { HttpRequest, HttpResponse, EmailValidator, Controller, AddAccount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'
import { Validation } from '../../helpers/validators/validation'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount
	private readonly validaton: Validation
	constructor (emailValidator: EmailValidator, addAccount: AddAccount, validaton: Validation) {
		this.emailValidator = emailValidator
		this.addAccount = addAccount
		this.validaton = validaton
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validaton.validate(httpRequest.body)
			if (error) {
				return badRequest(error)
			}
			const { name, email, password } = httpRequest.body

			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}
			const account = await this.addAccount.add({
				name,
				email,
				password
			})
			return ok(account)
		} catch (error) {
			return serverError(error)
		}
	}
}

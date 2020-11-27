import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-errors'

const factoryController = (): SignUpController => {
	return new SignUpController()
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name provided', () => {
		const controller = factoryController()
        const httpRequest = {
            body: {
                email: 'anmy@email.com',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = controller.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})
	test('Should return 400 if no email provided', () => {
		const controller = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = controller.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})
	test('Should return 400 if no password provided', () => {
        const controller = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
                email: 'anmy@email.com',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = controller.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})
	test('Should return 400 if no confirmation provided', () => {
        const controller = factoryController()
        const httpRequest = {
            body: {
                name: 'any',
				email: 'anmy@email.com',
				password: 'ahoy'
            }
        }

        const httpResponse = controller.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
})

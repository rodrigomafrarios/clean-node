import { SignUpController } from './signup'

describe('SignUp Controller', () => {
    test('Should return 400 if no name provided', () => {
        const controller = new SignUpController()
        const httpRequest = {
            body: {
                email: 'anmy@email.com',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = controller.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: name'))
	})
	test('Should return 400 if no email provided', () => {
        const controller = new SignUpController()
        const httpRequest = {
            body: {
                name: 'any',
                password: 'anypass',
                passwordConfirmation: 'any confirmation'
            }
        }

        const httpResponse = controller.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: email'))
    })
})

import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { serverError } from '@/presentation/helpers/http/http-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/tests/data/mocks'

interface SutTypes {
	sut: LogControllerDecorator
	controllerStub: Controller
	logErrorRepositoryStub: LogErrorRepository
}
const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				statusCode: 200,
				body: {
					email: 'any_mail@mail.com',
					name: 'any_name',
					password: '123',
					passwordConfirmation: '123'
				}
			}
			return Promise.resolve(httpResponse)
		}
	}
	return new ControllerStub()
}

const makeSut = (): SutTypes => {
	const controllerStub = makeController()
	const logErrorRepositoryStub = mockLogErrorRepository()
	const sut = new LogControllerDecorator(controllerStub,logErrorRepositoryStub)
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub
	}
}

describe('LogController Decorator', () => {
	test('Should call controller handle ', async () => {
		const { sut, controllerStub } = makeSut()
		const handleSpy = jest.spyOn(controllerStub, 'handle')
		const httpRequest = {
			body: {
				email: 'any_mail@mail.com',
				name: 'any_name',
				password: '123',
				passwordConfirmation: '123'
			}
		}
		await sut.handle(httpRequest)
		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})
	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_mail@mail.com',
				name: 'any_name',
				password: '123',
				passwordConfirmation: '123'
			}
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				email: 'any_mail@mail.com',
				name: 'any_name',
				password: '123',
				passwordConfirmation: '123'
			}
		})
	})
	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
		const fakeError = new Error()
		fakeError.stack = 'any_stack'
		const error = serverError(fakeError)
		const logSpy = jest.spyOn(logErrorRepositoryStub,'logError')
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
		const httpRequest = {
			body: {
				email: 'any_mail@mail.com',
				name: 'any_name',
				password: '123',
				passwordConfirmation: '123'
			}
		}
		await sut.handle(httpRequest)
		expect(logSpy).toHaveBeenCalledWith('any_stack')
	})
})

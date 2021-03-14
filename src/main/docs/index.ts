import { loginPath } from './paths'
import { accountSchema, loginParamsSchema, errorSchema } from './schemas'
import { badRequest, unauthorized, ok, serverError, notFound } from './components'

export default {
	openapi: '3.0.0',
	info: {
		title: 'Clean node/ts API',
		description: 'survey APIs',
		version: '1.0.0'
	},
	servers: [{
		url: '/api'
	}],
	tags: [{
		name: 'Login'
	}],
	paths: {
		'/login': loginPath
	},
	components: {
		badRequest,
		ok,
		serverError,
		unauthorized,
		notFound
	},
	schemas: {
		account: accountSchema,
		login: loginParamsSchema,
		error: errorSchema
	}
}

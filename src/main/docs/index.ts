import { loginPath, surveyPath } from './paths'
import { accountSchema, loginParamsSchema, errorSchema, surveySchema, surveysSchema, surveyAnswerSchema, apiKeyAuthScheme } from './schemas'
import { badRequest, unauthorized, ok, serverError, notFound, forbidden } from './components'

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
	tags: [
		{
			name: 'Login'
		},
		{
			name: 'Enquete'
		}
	],
	paths: {
		'/login': loginPath,
		'/surveys': surveyPath
	},
	components: {
		securitySchemes: {
			apiKeyAuth: apiKeyAuthScheme
		},
		badRequest,
		ok,
		serverError,
		unauthorized,
		notFound,
		forbidden
	},
	schemas: {
		account: accountSchema,
		login: loginParamsSchema,
		error: errorSchema,
		survey: surveySchema,
		surveys: surveysSchema,
		surveyAnswer: surveyAnswerSchema
	}
}

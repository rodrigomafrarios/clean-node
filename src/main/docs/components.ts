import { apiKeyAuthScheme } from './schemas/index'
import { badRequest, unauthorized, ok, serverError, notFound, forbidden } from './components/index'

export default {
	securitySchemes: {
		apiKeyAuth: apiKeyAuthScheme
	},
	badRequest,
	ok,
	serverError,
	unauthorized,
	notFound,
	forbidden
}

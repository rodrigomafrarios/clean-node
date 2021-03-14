export const loginPath = {
	post: {
		tags: ['Login'],
		summary: 'API para autenticar usuários',
		requestBody: {
			content: {
				'application/json': {
					schema: {
						$ref: '#/schemas/login'
					}
				}
			}
		},
		responses: {
			200: {
				$ref: '#/components/ok'
			},
			400: {
				$ref: '#/components/badRequest'
			},
			401: {
				$ref: '#/components/unauthorized'
			},
			404: {
				$ref: '#/components/notFound'
			},
			500: {
				$ref: '#/components/serverError'
			}
		}
	}
}

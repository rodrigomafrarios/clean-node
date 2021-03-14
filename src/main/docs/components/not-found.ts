export const notFound = {
	description: 'API não encontrada',
	content: {
		'application/json': {
			schema: {
				$ref: '#/schemas/error'
			}
		}
	}
}

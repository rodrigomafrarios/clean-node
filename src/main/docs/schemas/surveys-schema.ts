export const surveysSchema = {
	type: 'object',
	properties: {
		surveys: {
			type: 'array',
			items: {
				$ref: '#/schemas/survey'
			}
		}
	}
}

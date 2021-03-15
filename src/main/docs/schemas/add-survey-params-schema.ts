export const addSurveyParamsSchema = {
	type: 'object',
	properties: {
		id: {
			type: 'string'
		},
		question: {
			type: 'string'
		},
		answers: {
			type: 'array',
			items: {
				$ref: '#/schemas/surveyAnswer'
			}
		}
	}
}

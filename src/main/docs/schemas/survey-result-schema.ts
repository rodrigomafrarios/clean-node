export const surveyResultSchema = {
  type: 'object',
  properties: {
    id: {
			type: 'string'
		},
		surveyId: {
			type: 'string'
		},
		accountId: {
			type: 'string'
		},
		sanswer: {
			type: 'string'
		},
		date: {
			type: 'string'
		}
  },
  required: ['answer']
}

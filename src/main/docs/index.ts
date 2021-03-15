import paths from './paths'
import schemas from './schemas'
import components from './components'

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
	paths,
	components,
	schemas
}

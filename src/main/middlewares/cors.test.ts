import request from 'supertest'
import app from '@/main/config/app'

describe('CORS Middleware', () => {
	test('Should Enable CORS', async () => {
		app.get('/test_cors', (req,res) => {
			res.send()
		})
		await request(app)
		.get('/test_cors')
		.expect('access-control-allow-origin','*')
	})
})

import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
	app.use('/api', router)
	let isTestFile = false
  readdirSync(`${__dirname}/../routes`).map(async file => {
		isTestFile = !file.includes('.test') && !file.includes('.spec')
    if (!file.endsWith('.map') && isTestFile) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}

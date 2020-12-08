import express from 'express'
import setupMiddlewares from '../config/middlewars'
const app = express()
setupMiddlewares(app)
export default app

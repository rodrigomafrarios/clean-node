import express from 'express'
import setupMiddlewares from './middlewars'
import setupRoutes from './routes'
import setupSwagger from './config-swagger'
import setupApolloServer from './apollo-server'

const app = express()
setupApolloServer(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app

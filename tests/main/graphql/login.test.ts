import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { makeApolloServer } from './helpers'
import { ApolloServer, gql } from 'apollo-server-express'

let collection: Collection
let apolloServer: ApolloServer

beforeAll(async () => {
	await MongoHelper.connect(process.env.MONGO_URL)
  apolloServer = makeApolloServer()
})
afterAll(async () => {
	await MongoHelper.disconnect()
})
beforeEach(async () => {
	collection = await MongoHelper.getCollection('accounts')
	await collection.deleteMany({})
})

describe('Login - Graphql', () => {
  describe('Login Query', () => {
    const loginQuery = gql`
      query login ($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
        }
      }
    `
    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123',12)
      await collection.insertOne({
        name: 'Rodrigp',
        email: 'rodrigomafrarios@gmail.com',
        password
      })

      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: 'rodrigomafrarios@gmail.com',
          password: '123'
        }
      })
      expect(response.data.login.accessToken).toBeTruthy()
    })

    test('Should return Unauthorized error on wrong credentials', async () => {
      const password = await hash('123',12)
      await collection.insertOne({
        name: 'Rodrigp',
        email: 'rodrigomafrarios@gmail.com',
        password
      })

      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: 'rodrigomafrarios@gmail.com',
          password: '12'
        }
      })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Unauthorized')
    })

    test('Should return InvalidParamError on invalid email', async () => {
      const password = await hash('123',12)
      await collection.insertOne({
        name: 'Rodrigp',
        email: 'rodrigomafrarios@gmail.com',
        password
      })

      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: 'rodrigomafrarios',
          password: '123'
        }
      })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Invalid param: email')
    })
  })
})

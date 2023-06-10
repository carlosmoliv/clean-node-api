import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'

import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { createTestClient } from 'apollo-server-integration-testing'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login Graphql', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          name
        }
      }
    `
    it('Should return an account on valid credentials', async () => {
      const password = await hash('1234', 12)

      await accountCollection.insertOne({
        name: 'Carlos',
        email: 'carlosoliveira@gmail.com',
        password: password,
      })

      const { query } = createTestClient({ apolloServer })
      const rest: any = await query(loginQuery, {
        variables: {
          email: 'carlosoliveira@gmail.com',
          password: '1234',
        },
      })

      expect(rest.data.login.accessToken).toBeTruthy()
      expect(rest.data.login.name).toBe('Carlos')
    })

    it('Should return UnauthorizedError on invalid credentials', async () => {
      const password = await hash('1234', 12)

      const { query } = createTestClient({ apolloServer })
      const rest: any = await query(loginQuery, {
        variables: {
          email: 'carlosoliveira@gmail.com',
          password: '1234',
        },
      })

      expect(rest.data).toBeFalsy()
      expect(rest.errors[0].message).toBe('Unauthorized')
    })
  })
})

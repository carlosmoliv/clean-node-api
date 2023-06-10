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

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp(
        $name: String!
        $email: String!
        $password: String!
        $passwordConfirmation: String!
      ) {
        signUp(
          name: $name
          email: $email
          password: $password
          passwordConfirmation: $passwordConfirmation
        ) {
          accessToken
          name
        }
      }
    `
    it('Should return an account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })

      const rest: any = await mutate(signUpMutation, {
        variables: {
          name: 'Carlos',
          email: 'carlosoliveira@gmail.com',
          password: '1234',
          passwordConfirmation: '1234',
        },
      })

      expect(rest.data.signUp.accessToken).toBeTruthy()
      expect(rest.data.signUp.name).toBe('Carlos')
    })

    it('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('1234', 12)

      await accountCollection.insertOne({
        name: 'Carlos',
        email: 'carlosoliveira@gmail.com',
        password: password,
      })

      const { mutate } = createTestClient({ apolloServer })

      const rest: any = await mutate(signUpMutation, {
        variables: {
          name: 'Carlos',
          email: 'carlosoliveira@gmail.com',
          password: '1234',
          passwordConfirmation: '1234',
        },
      })

      expect(rest.data).toBeFalsy()
      expect(rest.errors[0].message).toBe(
        'The received email is already in use'
      )
    })
  })
})

import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'

import { MongoHelper } from '@/infra/db/mongodb/helpers'
import request from 'supertest'
import app from '@/main/config/app'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login Graphql', () => {
  beforeAll(async () => {
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
    const query = `
      query {
        login(email: "carlosoliveira@gmail.com", password: "1234") {
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

      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe('Carlos')
    })

    it('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `
      mutation {
        signUp(
          name: "Carlos"
          email: "carlosoliveira@gmail.com"
          password: "1234"
          passwordConfirmation: "1234"
        ) {
          accessToken
          name
        }
      }
    `
    it('Should return an account on valid data', async () => {
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe('Carlos')
    })

    it('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('1234', 12)

      await accountCollection.insertOne({
        name: 'Carlos',
        email: 'carlosoliveira@gmail.com',
        password,
      })

      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)

      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe(
        'The received email is already in use'
      )
    })
  })
})

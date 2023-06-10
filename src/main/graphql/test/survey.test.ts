import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'

import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { createTestClient } from 'apollo-server-integration-testing'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let accountCollection: Collection
let surveyCollection: Collection
let apolloServer: ApolloServer

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'johndoe@mail.com',
    password: '123456',
    role: 'admin',
  })

  const id = res.insertedId
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        accessToken,
      },
    }
  )

  return accessToken
}

describe('Survey Graphql', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})

    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const surveysQuery = gql`
      query surveys {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `
    it('Should return a list of surveys', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()

      await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            image: 'http://image-name.com',
            answer: 'Answer 1',
          },
          {
            answer: 'Answer 2',
          },
        ],
        date: now,
      })

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: { headers: { 'x-access-token': accessToken } },
      })
      const res: any = await query(surveysQuery)

      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toBeTruthy()
      expect(res.data.surveys[0].question).toBe('Question')
      expect(res.data.surveys[0].date).toBe(now.toISOString())
      expect(res.data.surveys[0].didAnswer).toBe(false)
      expect(res.data.surveys[0].answers).toEqual([
        {
          image: 'http://image-name.com',
          answer: 'Answer 1',
        },
        {
          image: null,
          answer: 'Answer 2',
        },
      ])
    })
  })
})

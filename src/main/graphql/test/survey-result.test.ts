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

describe('SurveyResult Graphql', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(env.mongoUri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResult($surveyId: String!) {
        surveyResult(surveyId: $surveyId) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    it('Should return a survey result', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()

      const surveyRes = await surveyCollection.insertOne({
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

      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString(),
        },
      })

      expect(res.data.surveyResult.question).toBe('Question')
      expect(res.data.surveyResult.date).toBe(now.toISOString())
      expect(res.data.surveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
      ])
    })
  })
})

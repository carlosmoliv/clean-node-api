import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { sign } from 'jsonwebtoken'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { Express } from 'express'

let accountCollection: Collection
let surveyCollection: Collection
let app: Express

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'John Doe',
    email: 'johndoe@mail.com',
    password: '123456',
    role: 'admin',
  })

  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne(
    {
      _id: res.insertedId,
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
    app = await setupApp()
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

      const query = `
        {
          surveyResult(surveyId: "${surveyRes.insertedId.toHexString()}") {
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

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('Question')
      expect(res.body.data.surveyResult.date).toBe(now.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([
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

    it('Should return a AccessDeniedError if token is not provided', async () => {
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
        date: new Date(),
      })

      const query = `
        {
          surveyResult(surveyId: "${surveyRes.insertedId.toHexString()}") {
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

      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  // TODO: isCurrentAccountAnswer is not working
  describe('SaveSurveyResult Mutation', () => {
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

      const query = `
        mutation {
          saveSurveyResult(surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 1") {
            question
            answers {
              answer
              count
              percent
            }
            date
          }
        }
      `

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('Question')
      expect(res.body.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 1,
          percent: 100,
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
        },
      ])
    })

    it('Should return a AccessDeniedError if token is not provided 1', async () => {
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
        date: new Date(),
      })

      const query = `
        mutation {
          saveSurveyResult(surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 1") {
            question
            answers {
              answer
              count
              percent
            }
            date
          }
        }
      `

      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)

      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})

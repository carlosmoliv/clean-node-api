import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/clean-node-api')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeAccessToken = async (): Promise<string> => {
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

  describe('POST /surveys', () => {
    it('should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
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
        })
        .expect(403)
    })

    it('should return 204 on add survey with a valid access token', async () => {
      const accessToken = await makeAccessToken()

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
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
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('should return 403 on add survey without access token', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    it('should return 200 on load surveys if a valid access token is passed', async () => {
      const accessToken = await makeAccessToken()

      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer',
            },
            {
              answer: 'other_answer',
            },
          ],
          date: new Date(),
        },
      ])

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})

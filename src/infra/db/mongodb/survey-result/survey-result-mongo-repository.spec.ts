import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer_1',
      },
      {
        answer: 'any_answer_2',
      },
      {
        answer: 'any_answer_3',
      },
    ],
    date: new Date(),
  })

  const survey = await surveyCollection.findOne({ _id: res.insertedId })
  if (!survey) throw Error('survey not found')

  return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<SurveyModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
  })

  const account = await accountCollection.findOne({ _id: res.insertedId })
  if (!account) throw Error('Account not found')

  return MongoHelper.map(account)
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/clean-node-api'
    )
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(new ObjectId(survey.id))
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })

    it('should update a survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      const res = await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      })

      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      })

      // const surveyResult = await surveyResultCollection
      //   .find({
      //     surveyId: new ObjectId(survey.id),
      //     accountId: new ObjectId(account.id),
      //   })
      //   .toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(new ObjectId(survey.id))
      expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load a survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()

      const res = await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(new ObjectId(survey.id))
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})

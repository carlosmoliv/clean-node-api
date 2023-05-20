import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection

describe('SurveyMongoRepository', () => {
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
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut()

      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()

      expect(count).toBe(1)
    })
  })

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())

      const survey = await sut.loadById(res.insertedId.toString())

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      await surveyCollection.insertMany(addSurveyModels)
      const sut = makeSut()

      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
    })
  })
})

import { Collection } from 'mongodb'
import FakeObjectId from 'bson-objectid'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
}

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

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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

      expect(survey.id).toBeTruthy()
    })

    it('should load return null if survey does not exists', async () => {
      const sut = makeSut()

      const survey = await sut.loadById(FakeObjectId().toHexString())

      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers()', () => {
    it('should load answers on success', async () => {
      // Arrange
      const res = await surveyCollection.insertOne(mockAddSurveyParams())

      const survey = await surveyCollection.findOne({
        _id: res.insertedId,
      })

      const sut = makeSut()

      // Act
      const answers = await sut.loadAnswers(survey._id.toHexString())

      // Assert
      expect(answers).toEqual([
        survey.answers[0].answer,
        survey.answers[1].answer,
      ])
    })

    it('should return an empty array if survey does not exists', async () => {
      const sut = makeSut()

      const answers = await sut.loadAnswers(new FakeObjectId().toHexString())

      expect(answers).toEqual([])
    })
  })

  describe('checkById()', () => {
    it('should return true if survey exists', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())

      const exists = await sut.checkById(FakeObjectId().toHexString())

      expect(exists).toBe(false)
    })

    it('should return false if survey exists', async () => {
      const sut = makeSut()
      const res = await surveyCollection.insertOne(mockAddSurveyParams())

      const exists = await sut.checkById(res.insertedId.toString())

      expect(exists).toBe(true)
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      // Arrange
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]

      const result = await surveyCollection.insertMany(addSurveyModels)

      const survey = await surveyCollection.findOne({
        _id: result.insertedIds[0],
      })

      const test = await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      })

      const sut = makeSut()

      // Act
      const surveys = await sut.loadAll(accountId)

      // Assert
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      // TODO: fix this test
      // expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })
})

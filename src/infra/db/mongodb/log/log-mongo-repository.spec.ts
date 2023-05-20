import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('LogMongoRepository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    const uri = process.env.MONGO_URL

    if (uri) {
      await MongoHelper.connect(uri)
    }
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should create an error log on success', async () => {
    const sut = makeSut()

    await sut.logError(faker.word.words())

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})

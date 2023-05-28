import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repositpory'
import { mockAddAccountParams } from '@/domain/test'

let accountCollection: Collection

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/clean-node-api'
    )
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()

      const addAccountParams = mockAddAccountParams()
      const isValid = await sut.add(addAccountParams)

      expect(isValid).toBe(true)
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)

      const account = await sut.loadByEmail(addAccountParams.email)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.password).toBe(addAccountParams.password)
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail(faker.internet.email())

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    it.skip('shoud update the account accessToken on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())

      const fakeAccount = await accountCollection.findOne({
        _id: res.insertedId,
      })
      // if (!fakeAccount) throw Error('Account not found')
      expect(fakeAccount.accessToken).toBeFalsy()

      const accessToken = faker.string.uuid()
      await sut.updateAccessToken(fakeAccount.id, accessToken)
      const account = await accountCollection.findOne({ _id: res.insertedId })

      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(accessToken)
    })
  })

  describe('loadByToken()', () => {
    let name = faker.person.fullName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.string.uuid()

    beforeEach(() => {
      name = faker.person.fullName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.string.uuid()
    })

    it('should return an account on loadByToken without role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      })

      const account = await sut.loadByToken(accessToken)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    it('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      })

      const account = await sut.loadByToken(accessToken, 'admin')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    it('should return null on loadByToken with a invalid role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      })

      const account = await sut.loadByToken(accessToken, 'admin')

      expect(account).toBeFalsy()
    })

    it('should return an account on loadByToken user is an admin', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      })

      const account = await sut.loadByToken(accessToken)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken(accessToken)

      expect(account).toBeFalsy()
    })
  })
})

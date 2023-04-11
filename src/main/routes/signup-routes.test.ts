import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/clean-node-api')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })

  it('should return an account on success', async () => {
    // await request(app)
    //   .post('/api/signup')
    //   .send({
    //     name: 'John Doe',
    //     email: 'johndoe@mail.com',
    //     password: '1234',
    //     passwordConfirmation: '1234',
    //   })
    //   .expect(200)
  })
})

import request from 'supertest'
import { setupApp } from '../config/app'
import { Express } from 'express'

let app: Express

describe('CORS Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
  })
})

import request from 'supertest'
import app from '../../config/app'

describe('Content-type MiddleWare suite', () => {
  test('Should return default content-type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})

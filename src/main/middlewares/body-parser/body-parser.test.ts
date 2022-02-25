import request from 'supertest'
import app from '../../config/app'

describe('Body parser MiddleWare suite', () => {
  test('Should parse the received body of request as JSON', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Lucas' })
      .expect({ name: 'Lucas' })
  })
})

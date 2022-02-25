import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})
beforeEach(async () => {
  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

describe('Login routes suite', () => {
  describe('SignUp route',() => {
    test('Should return an account on signup', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'Lucas Gois',
          email: 'lucas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })

      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBeTruthy()
      expect(res.body.name).toBe('Lucas Gois')
      expect(res.body.email).toBe('lucas@gmail.com')
      expect(res.body.password).not.toBe('123456')
    })
  })

  describe('Login route', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)

      await accountCollection.insertOne({
        name: 'Lucas Gois',
        email: 'lucas@gmail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login with wrong credentials', async () => {
      const password = await hash('1234', 12)

      await accountCollection.insertOne({
        name: 'Lucas Gois',
        email: 'lucas@gmail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: '123'
        })
        .expect(401)
    })

    test('Should return 401 on login if user not exists', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'lucas@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})

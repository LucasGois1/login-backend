import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Account mongo suite', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(makeFakeAddAccount())
  })

  afterEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()

    const account = await sut.add(makeFakeAddAccount())

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an token on loadByEmail success', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('inexisting_email@mail.com')

    expect(account).toBeFalsy()
  })

  test('Should update accessToken on updateAccessToken success on add success', async () => {
    const sut = makeSut()

    const accountsCollection = await MongoHelper.getCollection('accounts')
    const addAccount = await accountsCollection.insertOne(makeFakeAddAccount())

    const account = await accountsCollection.findOne({ _id: addAccount.insertedId })

    expect(account.accessToken).toBeFalsy()
    await sut.updateAccessToken(account._id , 'any_token')
    const account2 = await accountsCollection.findOne({ _id: account._id })

    expect(account2).toBeTruthy()
    expect(account2.accessToken).toBe('any_token')
  })
})

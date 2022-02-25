import { LoginController } from './login-controller'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { MissingParamError } from '../../errors'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { badRequest, serverError, success, unauthorized } from '../../helper/http/http-helper'
import { HttpRequest, Authentication, Validation } from './login-controller-protocols'
import { AuthenticationModel } from '../../../domain/usecases/authentication'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidationStub = (): Validation => {
  // tslint:disable-next-line: max-classes-per-file
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeAuthenticationStub = (): Authentication => {
  // tslint:disable-next-line: max-classes-per-file
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidationStub()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('LoginController suite', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  beforeEach(async () => {
    const body: AddAccountModel = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(body)
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 401 if invalid credentials is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(unauthorized())
  })

  test('should returns 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResquest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    const response = await sut.handle(httpResquest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(success({
      accessToken: 'any_token'
    }))
  })

  test('should call Validation  with correct values',async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validator returns an error',async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})

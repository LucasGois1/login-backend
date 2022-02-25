import { MissingParamError, ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, Validation } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { HttpRequest } from '../../protocols'
import { serverError, success, badRequest } from '../../helper/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  // tslint:disable-next-line: max-classes-per-file
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('Sign up controller suite', () => {
  // test('should return 400 if no name is provided', async () => {
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body: {
  //       email: 'any_email@mail.com',
  //       password: 'any_password',
  //       passwordConfirmation: 'any_password'
  //     }
  //   }

  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  // })

  // test('should return 400 if no email is provided', async () => {
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       password: 'any_password',
  //       passwordConfirmation: 'any_password'
  //     }
  //   }

  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  // })

  // test('should return 400 if no password is provided',async () => {
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@mail.com',
  //       passwordConfirmation: 'any_password'
  //     }
  //   }

  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  // })

  // test('should return 400 if no confirmation password is provided',async () => {
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@mail.com',
  //       password: 'any_password'
  //     }
  //   }

  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  // })

  // test('should return 400 if no confirmation password fails',async () => {
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@mail.com',
  //       password: 'any_password',
  //       passwordConfirmation: 'invalid_password'
  //     }
  //   }

  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  // })

  // test('should return 400 if an invalid email is provided',async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  // })

  // test('should call email validator with correct email',async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

  //   await sut.handle(makeFakeRequest())
  //   expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  // })

  // test('should return 500 if email validator throws',async () => {
  //   // const addAccountStub = makeAddAccount()
  //   const { sut, emailValidatorStub } = makeSut()
  //   const fakeError = new Error()
  //   fakeError.stack = 'any_value'
  //   jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw fakeError })

  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(serverError(new ServerError(fakeError.stack)))
  // })

  test('should call addAccount  with correct values',async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  test('should return 500 if addAccount throws',async () => {
    const { sut, addAccountStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_value'
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(fakeError))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(fakeError.stack)))
  })

  test('should return 200 if an valid data is provided',async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(success(makeFakeAccount()))
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

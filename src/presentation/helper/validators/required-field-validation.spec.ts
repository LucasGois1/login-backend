import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
}

const makeSut = (): SutTypes => {
  const validations = [
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation')
  ]
  const sut = new ValidationComposite(validations)
  return {
    sut
  }
}

describe('EmailValidation suite', () => {
  test('should return an missing param error if no name is provided', () => {
    const { sut } = makeSut()
    const body = {
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const error = sut.validate(body)
    expect(error).toEqual(new MissingParamError('name'))
  })
  test('should return an missing param error if no email is provided', () => {
    const { sut } = makeSut()
    const body = {
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    const error = sut.validate(body)
    expect(error).toEqual(new MissingParamError('email'))
  })
  test('should return an missing param error if no password is provided', () => {
    const { sut } = makeSut()
    const body = {
      name: 'any_name',
      email: 'any_email@mail.com',
      passwordConfirmation: 'any_password'
    }
    const error = sut.validate(body)
    expect(error).toEqual(new MissingParamError('password'))
  })
  test('should return an missing param error if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const body = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const error = sut.validate(body)
    expect(error).toEqual(new MissingParamError('passwordConfirmation'))
  })
})

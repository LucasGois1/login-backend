import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
}

const makeSut = (): SutTypes => {
  const validations = [new CompareFieldsValidation('password', 'passwordConfirmation')]
  const sut = new ValidationComposite(validations)
  return {
    sut
  }
}

describe('EmailValidation suite', () => {
  test('should return an error if a invalid passwordConfirmation is provided', () => {
    const { sut } = makeSut()

    const body = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'invalid_password'
    }
    const error = sut.validate(body)
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })
})

import { InvalidParamError } from '../../errors'
import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'

const makeEmailValidator = (): EmailValidator => {
  // tslint:disable-next-line: max-classes-per-file
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')
  return {
    emailValidatorStub,
    sut
  }
}

describe('EmailValidation suite', () => {
  test('should return as error if email validator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'valid_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('should call email validator with correct email',async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'valid_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('should throw if email validator throws',async () => {
    // const addAccountStub = makeAddAccount()
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrow()
  })
})

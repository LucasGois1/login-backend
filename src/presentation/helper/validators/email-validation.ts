import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly emailValidation: EmailValidator
  private readonly fieldName: string
  constructor (emailValidation: EmailValidator, fieldName: string) {
    this.emailValidation = emailValidation
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    const isValid = this.emailValidation.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}

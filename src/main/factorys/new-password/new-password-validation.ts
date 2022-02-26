import { RequiredFieldValidation, ValidationComposite } from '../../../presentation/helper/validators'
import { Validation } from '../../../presentation/protocols/validation'

export const makeNewPasswordValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['newPassword', 'token']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}

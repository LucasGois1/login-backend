
import { LogControllerDecorator } from './../../decorators/log/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { NewPasswordController } from '../../../presentation/controllers/new-password/new-password-controller'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeNewPasswordValidation } from './new-password-validation'
import { DbChangePassword } from '../../../data/usecases/change-password/change-password'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeNewPasswordController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const hasher = new BcryptAdapter()
  const changePassword = new DbChangePassword(accountMongoRepository, accountMongoRepository, hasher)
  const logMongoRepository = new LogMongoRepository()
  const newPasswordValidations = makeNewPasswordValidation()
  const newPasswordController = new NewPasswordController(newPasswordValidations, changePassword)
  return new LogControllerDecorator(newPasswordController, logMongoRepository)
}

import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/controllers/signup/signup-controller-protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const hasher = new BcryptAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const addAccount = new DbAddAccount(hasher, accountMongoRepository)
  const signUpController = new SignUpController(addAccount, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logMongoRepository)
}

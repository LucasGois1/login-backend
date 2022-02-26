import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { EmailAdapter } from '../../../infra/email/email-adapter/email-adapter'
import { ForgotPasswordController } from '../../../presentation/controllers/forgot-password/forgot-password-controller'
import { SendEmail } from '../../../data/usecases/send-email/send-email'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { Controller } from './../../../presentation/protocols/controller'
import { makeForgotPasswordValidation } from './forgot-password-validation'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { DbEmailVerifier } from '../../../data/usecases/email-verifier/db-email-verifier'
import env from '../../config/env'

export const makeForgotPasswordController = (): Controller => {
  const accountRepository = new AccountMongoRepository()
  const dbEmailVerifier = new DbEmailVerifier(accountRepository)
  const forgotPasswordValidations = makeForgotPasswordValidation()
  const emailAdapter = new EmailAdapter(env.emailUser, env.emailPassword)
  const loginService = new SendEmail(emailAdapter, accountRepository)
  const forgotPasswordController = new ForgotPasswordController(forgotPasswordValidations, dbEmailVerifier, loginService)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(forgotPasswordController, logMongoRepository)
}

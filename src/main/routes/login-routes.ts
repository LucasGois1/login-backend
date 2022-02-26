import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeForgotPasswordController } from '../factorys/forgot-password/forgot-password-factory'
import { makeLoginController } from '../factorys/login/login-factory'
import { makeNewPasswordController } from '../factorys/new-password/new-password-factory'
import { makeSignUpController } from '../factorys/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/login', routeAdapter(makeLoginController()))
  router.post('/forgot-password', routeAdapter(makeForgotPasswordController()))
  router.post('/new-password', routeAdapter(makeNewPasswordController()))
}

import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeLoginController } from '../factorys/login/login-factory'
import { makeSignUpController } from '../factorys/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/login', routeAdapter(makeLoginController()))
}

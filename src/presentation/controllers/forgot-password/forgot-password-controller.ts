import { notFound } from './../../helper/http/http-helper'
import { Verifier } from './../../../domain/usecases/user-exists'
import { badRequest, serverError, success } from '../../helper/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from './forgot-password-protocols'

export class ForgotPasswordController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly emailVerifier: Verifier,
    private readonly loginService: LoginService
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email } = httpRequest.body

      if (!await this.emailVerifier.exist(email)) {
        return notFound('email')
      }
      this.loginService.sendForgotPasswordEmail(email)
      return success('')
    } catch (error) {
      return serverError(error)
    }
  }
}

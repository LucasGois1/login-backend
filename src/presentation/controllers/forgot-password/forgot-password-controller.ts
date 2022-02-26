import { notFound } from './../../helper/http/http-helper'
import { EmailVerifier } from '../../../domain/usecases/email-verifier'
import { badRequest, serverError, success } from '../../helper/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from './forgot-password-controller-protocols'
import { SendEmail } from '../../../data/usecases/send-email/send-email'

export class ForgotPasswordController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly emailVerifier: EmailVerifier,
    private readonly sendEmail: SendEmail
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
      await this.sendEmail.sendForgotPasswordEmail(email)
      return success('')
    } catch (error) {
      return serverError(error)
    }
  }
}

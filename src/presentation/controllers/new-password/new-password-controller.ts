
import { badRequest, serverError, success } from '../../helper/http/http-helper'
import { ChangePassword, Controller, HttpRequest, HttpResponse, Validation } from './new-password-controller-protocols'

export class NewPasswordController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly changePassword: ChangePassword
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { newPassword, token } = httpRequest.body

      const response = await this.changePassword.updatePassword({ newPassword, token })

      return success(response)
    } catch (error) {
      return serverError(error)
    }
  }
}

import { AddPasswordTokenModel } from '../../../../domain/usecases/add-password-token'

export interface AddPasswordTokenRepository {
  addPasswordToken: (passwordToken: AddPasswordTokenModel) => Promise<void>
}

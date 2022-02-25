import { AddPasswordToken, AddPasswordTokenModel } from '../../../domain/usecases/add-password-token'
import { AddPasswordTokenRepository } from '../../protocols/db/account/add-password-token-repository'

export class DbAddPasswordToken implements AddPasswordToken {
  constructor (
    private readonly addPasswordTokenRepository: AddPasswordTokenRepository
  ) {}

  async add (passwordToken: AddPasswordTokenModel): Promise<void> {
    await this.addPasswordTokenRepository.addPasswordToken(passwordToken)
  }
}

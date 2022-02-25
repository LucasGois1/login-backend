import { AddPasswordToken, AddPasswordTokenModel } from '../../../domain/usecases/add-password-token'

export class DbAddPasswordToken implements AddPasswordToken {
  constructor (
    private readonly addPasswordTokenRepository: AddPasswordTokenRepository
  ) {}

  async add (passwordToken: AddPasswordTokenModel): Promise<void> {
    await this.addPasswordTokenRepository.add(passwordToken)
  }
}

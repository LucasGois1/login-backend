import { ChangePassword, ChangePasswordModel, LoadAccountByPasswordTokenRepository, UpdatePasswordRepository } from './change-password-protocols'

export class DbChangePassword implements ChangePassword {
  constructor (
    private readonly loadAccountByPasswordToken: LoadAccountByPasswordTokenRepository,
    private readonly updatePasswordRepository: UpdatePasswordRepository
  ) {}

  async updatePassword (changePassword: ChangePasswordModel): Promise<boolean> {
    const account = await this.loadAccountByPasswordToken.loadByPasswordToken(changePassword.token)
    if (account) {
      await this.updatePasswordRepository.updatePassword(account.id, changePassword.newPassword)
      return new Promise(resolve => resolve(true))
    }
    return new Promise(resolve => resolve(false))
  }
}

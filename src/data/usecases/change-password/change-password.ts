import { Hasher } from '../../protocols/criptography/hasher'
import { ChangePassword, ChangePasswordModel, LoadAccountByPasswordTokenRepository, UpdatePasswordRepository } from './change-password-protocols'

export class DbChangePassword implements ChangePassword {
  constructor (
    private readonly loadAccountByPasswordToken: LoadAccountByPasswordTokenRepository,
    private readonly updatePasswordRepository: UpdatePasswordRepository,
    private readonly hasher: Hasher
  ) {}

  async updatePassword (changePassword: ChangePasswordModel): Promise<boolean> {
    console.log(changePassword)
    const account = await this.loadAccountByPasswordToken.loadByPasswordToken(changePassword.token)
    console.log(account)
    if (account) {
      const hashedPassword = await this.hasher.hash(changePassword.newPassword)
      console.log(hashedPassword)
      await this.updatePasswordRepository.updatePassword(account.id, hashedPassword)
      return new Promise(resolve => resolve(true))
    }
    return new Promise(resolve => resolve(false))
  }
}

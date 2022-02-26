import { randomUUID } from 'crypto'
import { AddPasswordTokenRepository } from '../../protocols/db/account'
import { EmailSender } from '../../protocols/email/email-sender'

export class SendEmail {
  constructor (
    private readonly emailService: EmailSender,
    private readonly addPasswordTokenRepository: AddPasswordTokenRepository
  ) {}

  async sendForgotPasswordEmail (email: string): Promise<boolean> {
    const passwordToken = randomUUID()

    await this.addPasswordTokenRepository.addPasswordToken({ email, token: passwordToken })

    const subject = 'Redefinir senha'
    const message = `Para redefinir sua senha, clique no link http://localhost:3000/forgot-password?passwordToken=${passwordToken}`
    return await this.emailService.send(subject, message, email)
  }
}

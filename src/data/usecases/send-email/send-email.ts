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
    const message = `Para redefinir sua senha, clique no link http://localhost:3000/forgot-password?passwordToken=${passwordToken}`
    const subject = 'Redefinir senha'
    console.log(passwordToken)
    console.log(message)
    await this.addPasswordTokenRepository.addPasswordToken({ email, token: passwordToken })

    return this.emailService.send(subject, message, email)
  }
}

import { randomUUID } from 'crypto'
import EmailSender from '../../../data/protocols/email/email-sender'

export default class LoginService {
  constructor (
    private readonly emailService: EmailSender,
    private readonly addTokenRepository: AddPasswordTokenRepository
  ) {}

  async sendForgotPasswordEmail (email: string): Promise<boolean> {
    const passwordToken = randomUUID()

    const subject = 'Redefinir senha'
    const message = `Para redefinir sua senha, clique no link http://localhost:3000/forgot-password?passwordToken=${passwordToken}`
    return await this.emailService.send(subject, message, email)
  }
}

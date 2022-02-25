import { nodemailer } from 'nodemailer'
import EmailSender from '../../../data/protocols/email/email-sender'

export class EmailAdapter implements EmailSender {
  constructor (
    private readonly username: string,
    private readonly password: string
  ) {}

  // async..await is not allowed in global scope, must use a wrapper
  async send (subject: string, text: string, destinatary: string): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.username,
        pass: this.password // generated ethereal password
      }
    })

    const response = await transporter.sendMail({
      from: `"Lucas Góis 👻" <${this.username}>`,
      to: destinatary,
      subject,
      text
    })
    return new Promise((resolve) => resolve(!!response))
  }
}

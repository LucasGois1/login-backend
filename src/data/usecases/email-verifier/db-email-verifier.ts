import { LoadAccountByEmailRepository, EmailVerifier } from './db-email-verifier-protocols'

export class DbEmailVerifier implements EmailVerifier {
  constructor (
    private readonly loadAccountByEmail: LoadAccountByEmailRepository
  ) {}

  async exist (email: string): Promise<boolean> {
    const account = await this.loadAccountByEmail.loadByEmail(email)
    if (account) {
      return new Promise(resolve => resolve(true))
    }

    return new Promise(resolve => resolve(false))
  }
}

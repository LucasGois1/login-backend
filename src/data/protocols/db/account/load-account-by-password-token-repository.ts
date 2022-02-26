import { AccountModel } from './../../../../domain/models/account'
export interface LoadAccountByPasswordTokenRepository {
  loadByPasswordToken: (token: string) => Promise<AccountModel>
}

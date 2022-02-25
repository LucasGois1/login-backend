import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AddPasswordTokenRepository } from '../../../../data/protocols/db/account'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AddPasswordTokenModel } from '../../../../domain/usecases/add-password-token'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AddPasswordTokenRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(account)
    const document = await accountCollection.findOne({ _id: result.insertedId })

    return document && MongoHelper.idMapper(document)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const document = await accountCollection.findOne({ email })
    return document && MongoHelper.idMapper(document)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id },{ $set: { accessToken: token } })
  }

  async addPasswordToken (passwordToken: AddPasswordTokenModel): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne({ email: passwordToken.email },{ $set: { passwordToken: passwordToken.token } })
  }
}

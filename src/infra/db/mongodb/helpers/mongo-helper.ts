import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  idMapper (collection: any): any {
    const collectionParsed = JSON.parse(JSON.stringify(collection))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const collectionReassign = Object.assign({}, collectionParsed, { id: collectionParsed._id })
    const { _id, ...objectWithId } = collectionReassign
    return objectWithId
  }
}

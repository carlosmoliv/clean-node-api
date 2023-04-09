import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(uri: string): Promise<void> {
    // if (!process.env.MONGO_URI) throw new Error('MongoDB URI not found')
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection

    return {
      id: _id.toHexString(),
      ...collectionWithoutId,
    }
  },
}

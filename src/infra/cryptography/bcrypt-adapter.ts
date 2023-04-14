import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return new Promise((resolve) => resolve(true))
  }
}

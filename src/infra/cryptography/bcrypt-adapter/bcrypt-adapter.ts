import bcrypt from 'bcrypt'
import { Hasher } from '@/data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {
    this.salt = salt
  }

  async hash(plaintext: string): Promise<string> {
    const digest = await bcrypt.hash(plaintext, this.salt)
    return digest
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest)
    return isValid
  }
}

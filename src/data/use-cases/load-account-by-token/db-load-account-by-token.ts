import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly descrypter: Decrypter) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.descrypter.decrypt(accessToken)
    return null
  }
}

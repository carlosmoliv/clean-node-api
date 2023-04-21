import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly descrypter: Decrypter,
    private readonly loadAcountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.descrypter.decrypt(accessToken)

    if (token) {
      await this.loadAcountByTokenRepository.loadByToken(accessToken, role)
    }

    return null
  }
}

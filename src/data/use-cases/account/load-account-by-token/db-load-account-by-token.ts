import {
  AccountModel,
  Decrypter,
  LoadAccountByToken,
  LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly descrypter: Decrypter,
    private readonly loadAcountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.descrypter.decrypt(accessToken)

    if (token) {
      const account = await this.loadAcountByTokenRepository.loadByToken(
        accessToken,
        role
      )

      if (account) return account
    }

    return null
  }
}

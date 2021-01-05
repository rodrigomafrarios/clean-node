import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
export class DbLoadAccountByToken implements LoadAccountByToken {
    private readonly decrypter: Decrypter
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    constructor (decrypter: Decrypter, loadAccountByTokenRepository: LoadAccountByTokenRepository) {
        this.decrypter = decrypter
        this.loadAccountByTokenRepository = loadAccountByTokenRepository
    }

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
        }
        return null
    }
}

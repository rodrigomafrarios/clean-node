import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'
export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const account = new AccountMongoRepository()
    return new DbLoadAccountByToken(jwtAdapter, account)
}

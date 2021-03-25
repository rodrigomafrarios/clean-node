import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  }
}

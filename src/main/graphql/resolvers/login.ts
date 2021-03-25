import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
  }
}

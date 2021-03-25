import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories/controllers/load-surveys/load-survey-controller-factory'

export default {
  Query: {
    surveys: async (parent: any, args: any) => adaptResolver(makeLoadSurveysController())
  }
}

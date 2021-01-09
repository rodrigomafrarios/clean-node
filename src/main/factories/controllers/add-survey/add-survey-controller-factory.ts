import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols/controller'
import { makeDbAddSurvey } from '@/main/factories/usecases/add-survey/db-add-survey-factory'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorators/log-controller-decorator-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
    const controller = new AddSurveyController(makeAddSurveyValidation(),makeDbAddSurvey())
    return makeLogControllerDecorator(controller)
}

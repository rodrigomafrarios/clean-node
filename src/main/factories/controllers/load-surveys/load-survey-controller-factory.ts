import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases/load-surveys/db-load-surveys'

export const makeLoadSurveysController = (): Controller => {
	const controller = new LoadSurveysController(makeDbLoadSurveys())
	return makeLogControllerDecorator(controller)
}

import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express-routes-adapter'

export default (router: Router): void => {
	router.post('/surveys', adaptRoute(makeAddSurveyController()))
}

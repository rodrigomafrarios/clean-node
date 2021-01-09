import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys/load-survey-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'
export default (router: Router): void => {
	router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
	router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}

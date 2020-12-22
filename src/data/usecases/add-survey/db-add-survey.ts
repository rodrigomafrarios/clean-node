import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
    private readonly addSurveyRepository: AddSurveyRepository
    constructor (addSurveyRepository: AddSurveyRepository) {
        this.addSurveyRepository = addSurveyRepository
    }

    async add (data: AddSurveyModel): Promise<void> {
        await this.addSurveyRepository.add(data)
        return new Promise(resolve => resolve())
    }
}

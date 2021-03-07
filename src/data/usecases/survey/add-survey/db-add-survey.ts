import { AddSurvey, AddSurveyParams, AddSurveyRepository } from './add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
    private readonly addSurveyRepository: AddSurveyRepository
    constructor (addSurveyRepository: AddSurveyRepository) {
        this.addSurveyRepository = addSurveyRepository
    }

    async add (data: AddSurveyParams): Promise<void> {
        await this.addSurveyRepository.add(data)
    }
}

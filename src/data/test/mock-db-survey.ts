import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '../use-cases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyRepository.Params

  async add(data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurveyModel()
  id: string

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveysModel()
  accountId: string

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return Promise.resolve(this.surveyModels)
  }
}

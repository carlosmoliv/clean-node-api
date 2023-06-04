import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import {
  LoadAnswersBySurveyRepository,
  SurveyModel,
} from '../use-cases/survey/load-answers-by-survey/db-load-answers-by-survey-protocols'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'
import { CheckSurveyByIdRepository } from '../protocols/db/survey/check-survey-by-id-repository'
import { faker } from '@faker-js/faker'

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

export class LoadAnswersBySurveyRepositorySpy
  implements LoadAnswersBySurveyRepository
{
  result = [faker.word.sample(), faker.word.sample()]
  id: string

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result = true
  id: string

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
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

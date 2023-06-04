import { AddSurvey } from '@/domain/use-cases/survey/add-survey'
import {
  LoadSurveys,
  SurveyModel,
} from '../controllers/survey/load-surveys/load-surveys-controller-protocols'
import { mockSurveysModel } from '@/domain/test'
import { CheckSurveyById } from '../controllers/load-survey-result/load-survey-result-controller-protocols'
import { LoadAnswersBySurvey } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { faker } from '@faker-js/faker'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add(data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveysModel()
  accountId: string

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return Promise.resolve(this.surveyModels)
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.word.sample(), faker.word.sample()]
  id: string

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  id: string

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}

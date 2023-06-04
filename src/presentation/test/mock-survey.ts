import { AddSurvey } from '@/domain/use-cases/survey/add-survey'
import {
  LoadSurveys,
  SurveyModel,
} from '../controllers/survey/load-surveys/load-surveys-controller-protocols'
import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { LoadSurveyById } from '@/domain/use-cases/survey/load-survey-by-id'
import { CheckSurveyById } from '../controllers/load-survey-result/load-survey-result-controller-protocols'

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

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel()
  id: string

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id
    return Promise.resolve(this.surveyModel)
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

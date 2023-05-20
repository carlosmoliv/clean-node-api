import {
  AddSurvey,
  AddSurveyParams,
} from '@/domain/use-cases/survey/add-survey'
import {
  LoadSurveys,
  SurveyModel,
} from '../controllers/survey/load-surveys/load-surveys-controller-protocols'
import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { LoadSurveyById } from '@/domain/use-cases/survey/load-survey-by-id'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveysModel()
  callsCount = 0

  async load(): Promise<SurveyModel[]> {
    this.callsCount++
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

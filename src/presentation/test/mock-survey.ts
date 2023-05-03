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

export const mockAddSurvey = (): AddSurvey => {
  class AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new AddSurvey()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysModel())
    }
  }

  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(mockSurveyModel()))
    }
  }

  return new LoadSurveyByIdStub()
}

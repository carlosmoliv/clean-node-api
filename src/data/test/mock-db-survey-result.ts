import { mockSurveyResultModel } from '@/domain/test'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import {
  SaveSurveyResult,
  SurveyResultModel,
} from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  saveSurveyResultParams: SaveSurveyResult.Params

  async save(data: SaveSurveyResult.Params): Promise<void> {
    this.saveSurveyResultParams = data
    return Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  result = mockSurveyResultModel()

  surveyId: string
  accountId: string

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId

    return this.result
  }
}

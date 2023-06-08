import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/use-cases/survey-result/load-survey-result'
import { SaveSurveyResult } from '@/domain/use-cases/survey-result/save-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSurveyResultModel()
  saveSurveyResultParams: SaveSurveyResult.Params

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data
    return this.result
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async load(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId

    return this.result
  }
}

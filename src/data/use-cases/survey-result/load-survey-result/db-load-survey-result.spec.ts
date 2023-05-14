import { mockSurveyResultModel } from '@/domain/test'
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResultUseCase', () => {
  it('should call LoadSurveyResultRepository with correct values', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        return new Promise((resolve) => resolve(mockSurveyResultModel()))
      }
    }

    const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()

    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )

    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})

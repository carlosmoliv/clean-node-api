import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/load-survey-by-id/load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/use-cases/survey-result/db-survey-result-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )

  return makeLogControllerDecorator(controller)
}

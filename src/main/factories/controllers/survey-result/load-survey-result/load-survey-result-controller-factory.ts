import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/load-survey-by-id/load-survey-by-id-factory'
import { makeDbLoadSurveyResult } from '@/main/factories/use-cases/load-survey-result/db-load-survey-result-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult()
  )

  return makeLogControllerDecorator(controller)
}

import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/use-cases/survey-result/db-survey-result-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { makeDbLoadAnswersBySurvey } from '@/main/factories/use-cases/load-answers-by-survey/load-answers-by-survey-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult()
  )

  return makeLogControllerDecorator(controller)
}

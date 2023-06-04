import { DbLoadAnswersBySurvey } from '@/data/use-cases/survey/load-answers-by-survey/db-load-answers-by-survey'
import { LoadAnswersBySurvey } from '@/domain/use-cases/survey/load-answers-by-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}

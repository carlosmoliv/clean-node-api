import { AddSurveyParams } from '../../../../domain/use-cases/survey/add-survey'

export interface AddSurveyRepository {
  add(surveyData: AddSurveyParams): Promise<void>
}

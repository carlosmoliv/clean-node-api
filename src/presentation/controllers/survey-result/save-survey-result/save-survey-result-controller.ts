import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.loadSurveyById.loadById(httpRequest.params.surveyId)

    return null
  }
}

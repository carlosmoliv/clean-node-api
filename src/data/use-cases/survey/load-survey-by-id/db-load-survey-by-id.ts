import {
  LoadSurveyById,
  LoadSurveyByIdRepository,
  SurveyModel,
} from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {
    this.loadSurveyByIdRepository = loadSurveyByIdRepository
  }

  async loadById(id: string): Promise<LoadSurveyById.Result> {
    return this.loadSurveyByIdRepository.loadById(id)
  }
}

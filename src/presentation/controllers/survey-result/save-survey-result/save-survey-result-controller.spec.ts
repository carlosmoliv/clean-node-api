import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
} from './save-survey-result-controller-protocols'
import { forbidden } from '@/presentation/helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(makeFakeSurvey()))
    }
  }

  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub,
  }
}

describe('SaveSurveyResultController', () => {
  it('should call LoadSurveyById with the correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})

import { faker } from '@faker-js/faker'
import { LoadAnswersBySurveyRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy =
    new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)

  return {
    sut,
    loadAnswersBySurveyRepositorySpy,
  }
}

let surveyId: string

describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.string.uuid()
  })

  it('should call LoadAnswersBySurveyRepository', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()

    await sut.loadAnswers(surveyId)

    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId)
  })

  it('should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()

    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1],
    ])
  })

  it('should return an empty array if LoadAnswersBySurveyRepository returns []', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []

    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([])
  })

  it('should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
      .mockImplementationOnce(throwError)

    const promise = sut.loadAnswers(surveyId)

    await expect(promise).rejects.toThrow()
  })
})

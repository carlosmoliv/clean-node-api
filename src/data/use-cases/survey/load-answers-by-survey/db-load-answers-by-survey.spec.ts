import { faker } from '@faker-js/faker'
import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy,
  }
}

let surveyId: string

describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.string.uuid()
  })

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()

    await sut.loadAnswers(surveyId)

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()

    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.result.answers[0].answer,
      loadSurveyByIdRepositorySpy.result.answers[1].answer,
    ])
  })

  it('should return an empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null

    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([])
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError)

    const promise = sut.loadAnswers(surveyId)

    await expect(promise).rejects.toThrow()
  })
})

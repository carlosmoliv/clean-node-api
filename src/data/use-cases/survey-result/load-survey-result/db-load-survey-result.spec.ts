import { faker } from '@faker-js/faker'
import { DbLoadSurveyResult } from './db-load-survey-result'
import {
  LoadSurveyResultRepositorySpy,
  LoadSurveyByIdRepositorySpy,
} from '@/data/test'
import { throwError } from '@/domain/test'
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from './db-load-survey-result-protocols'
import MockDate from 'mockdate'
import { mock } from 'node:test'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
  }
}

let surveyId: string

describe('DbLoadSurveyResultUseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.string.uuid()
  })

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load(surveyId)
    await expect(promise).rejects.toThrow()
  })

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    await sut.load(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('should return surveyResultltModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null

    const surveyResult = await sut.load(surveyId)
    const { surveyModel } = loadSurveyByIdRepositorySpy

    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map((answer) =>
        Object.assign({}, answer, {
          count: 0,
          percent: 0,
        })
      ),
    })
  })

  it('should return a surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    const surveyResult = await sut.load(surveyId)

    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    )
  })
})

import { faker } from '@faker-js/faker'
import { DbLoadSurveyResult } from './db-load-survey-result'
import {
  LoadSurveyResultRepositorySpy,
  LoadSurveyByIdRepositorySpy,
} from '@/data/test'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'

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
let accountId: string

describe('DbLoadSurveyResultUseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.string.uuid()
    accountId = faker.string.uuid()
  })

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut()
    loadSurveyResultRepositorySpy.result = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('should return surveyResultltModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut()
    loadSurveyResultRepositorySpy.result = null

    const surveyResult = await sut.load(surveyId, accountId)
    const { result } = loadSurveyByIdRepositorySpy

    expect(surveyResult).toEqual({
      surveyId: result.id,
      question: result.question,
      date: result.date,
      answers: result.answers.map((answer) =>
        Object.assign({}, answer, {
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        })
      ),
    })
  })

  it('should return a surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    const surveyResult = await sut.load(surveyId, accountId)

    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})

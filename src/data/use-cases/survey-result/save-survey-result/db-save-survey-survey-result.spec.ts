import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from './db-save-survey-result-protocols'
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
  throwError,
} from '@/domain/test'
import { mockSaveSurveyResultRepository } from '@/data/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyRepositoryResultStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyRepositoryResultStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyRepositoryResultStub)

  return {
    sut,
    saveSurveyRepositoryResultStub,
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call SaveSurveyRepository with correct values', async () => {
    const { sut, saveSurveyRepositoryResultStub } = makeSut()

    const saveSpy = jest.spyOn(saveSurveyRepositoryResultStub, 'save')
    const surveyResultData = mockSaveSurveyResultParams()

    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  it('should throw if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyRepositoryResultStub } = makeSut()

    jest
      .spyOn(saveSurveyRepositoryResultStub, 'save')
      .mockImplementationOnce(throwError)

    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})

import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from './db-save-survey-result-protocols'

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date(),
})

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' })

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyRepositoryResultStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyRepositoryResultStub = makeSaveSurveyResultRepository()
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
    const surveyResultData = makeFakeSurveyResultData()

    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  it('should throw if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyRepositoryResultStub } = makeSut()

    jest
      .spyOn(saveSurveyRepositoryResultStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  it('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(makeFakeSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})

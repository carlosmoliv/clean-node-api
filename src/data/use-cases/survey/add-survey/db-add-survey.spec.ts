import { mockAddSurveyParams, throwError } from '@/domain/test'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)

  return {
    sut,
    addSurveyRepositorySpy,
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()

    const surveyData = mockAddSurveyParams()

    await sut.add(surveyData)
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData)
  })

  it('should throw an error if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()

    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError)

    const promise = sut.add(mockAddSurveyParams())

    await expect(promise).rejects.toThrow()
  })
})

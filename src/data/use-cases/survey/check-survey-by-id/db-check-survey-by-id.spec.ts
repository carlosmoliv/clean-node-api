import MockDate from 'mockdate'
import { CheckSurveyByIdRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import { faker } from '@faker-js/faker'
import { DbCheckSurveyById } from './db-check-survey-by-id'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

  return {
    sut,
    checkSurveyByIdRepositorySpy,
  }
}
let surveyId: string

describe('DbCheckLoadById', () => {
  beforeEach(() => {
    surveyId = faker.string.uuid()
  })

  it('should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()

    await sut.checkById(surveyId)

    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('should return false if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()

    const exists = await sut.checkById(surveyId)

    expect(exists).toBe(true)
  })

  it('should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false

    const exists = await sut.checkById(surveyId)

    expect(exists).toBe(false)
  })

  it('should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest
      .spyOn(checkSurveyByIdRepositorySpy, 'checkById')
      .mockImplementationOnce(throwError)

    const promise = sut.checkById(surveyId)

    await expect(promise).rejects.toThrow()
  })
})

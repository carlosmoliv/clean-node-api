import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper'
import {
  SaveSurveyResultSpy,
  LoadAnswersBySurveySpy,
} from '@/presentation/test'
import { throwError } from '@/domain/test'

const mockRequest = (
  answer: string = null
): SaveSurveyResultController.Request => ({
  surveyId: faker.string.uuid(),
  answer,
  accountId: faker.string.uuid(),
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurvey: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurvey = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()

  const sut = new SaveSurveyResultController(
    loadAnswersBySurvey,
    saveSurveyResultSpy
  )

  return {
    sut,
    loadAnswersBySurvey,
    saveSurveyResultSpy,
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadAnswersBySurvey with the correct values', async () => {
    const { sut, loadAnswersBySurvey } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(loadAnswersBySurvey.id).toBe(request.surveyId)
  })

  it('should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurvey } = makeSut()
    loadAnswersBySurvey.result = []

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurvey } = makeSut()
    jest
      .spyOn(loadAnswersBySurvey, 'loadAnswers')
      .mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with the correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut()
    const request = mockRequest(loadAnswersBySurvey.result[0])

    await sut.handle(request)

    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer,
    })
  })

  it('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const request = mockRequest(loadAnswersBySurvey.result[0])

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut()

    const request = mockRequest(loadAnswersBySurvey.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})

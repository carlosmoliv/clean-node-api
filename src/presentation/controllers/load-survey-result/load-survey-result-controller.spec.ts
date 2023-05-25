import { LoadSurveyResultController } from './load-survey-result-controller'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { InvalidParamError } from '@/presentation/errors'

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.string.uuid(),
  surveyId: faker.string.uuid(),
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  )

  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy,
  }
}

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSUrveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()

    const request = mockRequest()

    await sut.handle(request)
    expect(loadSurveyByIdSpy.id).toBe(request.surveyId)
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.surveyModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId)
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId)
  })

  it('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResultModel))
  })
})

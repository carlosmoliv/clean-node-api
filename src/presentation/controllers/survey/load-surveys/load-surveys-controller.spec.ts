import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import mockdate from 'mockdate'
import { LoadSurveysSpy } from '@/presentation/test'
import { throwError } from '@/domain/test'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)

  return {
    sut,
    loadSurveysSpy,
  }
}

describe('LoadSurveysController', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })

  afterAll(() => {
    mockdate.reset()
  })

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSut()

    await sut.handle({})

    expect(loadSurveysSpy.callsCount).toBe(1)
  })

  it('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels))
  })

  it('should return 204 if LoadSurveys returns an empty result', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveyModels = []

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(noContent())
  })

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

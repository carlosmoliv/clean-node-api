import MockDate from 'mockdate'
import {
  HttpRequest,
  Validation,
  AddSurvey,
} from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockAddSurvey } from '@/presentation/test'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
})

const mockValidation = (): Validation => {
  class ValidationStub {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub,
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httRequest = makeFakeRequest()

    await sut.handle(httRequest)

    expect(validateSpy).toHaveBeenCalledWith(httRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httRequest = makeFakeRequest()

    await sut.handle(httRequest)

    expect(addSpy).toHaveBeenCalledWith(httRequest.body)
  })

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()

    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(serverError(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut, addSurveyStub } = makeSut()

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(noContent())
  })
})

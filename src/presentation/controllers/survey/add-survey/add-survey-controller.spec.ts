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
import { faker } from '@faker-js/faker'
import { AddSurveySpy, ValidationSpy } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    question: faker.word.words(),
    answers: [
      {
        image: faker.image.url(),
        answer: faker.word.sample(),
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
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)

  return {
    sut,
    validationSpy,
    addSurveySpy,
  }
}

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call Validation with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(addSurveySpy.addSurveyParams).toEqual(httpRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(addSurveySpy.addSurveyParams).toEqual(httpRequest.body)
  })

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError)

    const httResponse = await sut.handle(mockRequest())

    expect(httResponse).toEqual(serverError(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(noContent())
  })
})

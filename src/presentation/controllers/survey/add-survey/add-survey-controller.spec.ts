import {
  HttpRequest,
  Validation,
  AddSurvey,
  AddSurveyModel,
} from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
})

const makeValidation = (): Validation => {
  class ValidationStub {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new AddSurvey()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub,
  }
}

describe('AddSurvey Controller', () => {
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

    jest
      .spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(serverError(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut, addSurveyStub } = makeSut()

    const httResponse = await sut.handle(makeFakeRequest())

    expect(httResponse).toEqual(noContent())
  })
})
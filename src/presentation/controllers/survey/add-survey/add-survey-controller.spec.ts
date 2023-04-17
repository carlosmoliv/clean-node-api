import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

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

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    class ValidationStub {
      validate(input: any): Error {
        return null
      }
    }

    const validationStub = new ValidationStub()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const sut = new AddSurveyController(validationStub)

    const httRequest = makeFakeRequest()

    await sut.handle(httRequest)
  })
})

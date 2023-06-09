import { faker } from '@faker-js/faker'
import { InvalidParamError } from '../../presentation/errors'
import { EmailValidation } from './email-validation'
import { EmailValidatorSpy } from '../test'
import { throwError } from '@/domain/test'

const field = faker.word.sample()

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(field, emailValidatorSpy)

  return { sut, emailValidatorSpy }
}

describe('Email Validation', () => {
  it.skip('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const email = faker.internet.email()

    const error = sut.validate({ [field]: email })

    expect(error).toEqual(new InvalidParamError(field))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()

    sut.validate({ [field]: email })

    expect(emailValidatorSpy.email).toBe(email)
  })

  it('Should throw is EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut()

    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)

    expect(sut.validate).toThrow()
  })
})

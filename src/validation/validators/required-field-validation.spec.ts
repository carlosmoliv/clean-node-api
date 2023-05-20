import { faker } from '@faker-js/faker'
import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const field = faker.word.sample()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({ invalidField: faker.word.sample() })

    expect(error).toEqual(new MissingParamError(field))
  })

  it('Should return nothing if validation succeeds', () => {
    const sut = makeSut()

    const error = sut.validate({ [field]: faker.word.sample() })

    expect(error).toBeFalsy()
  })
})

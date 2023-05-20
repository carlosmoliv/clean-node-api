import { faker } from '@faker-js/faker'
import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '@/presentation/errors'

const field = faker.word.sample()
const fieldToCompare = faker.word.sample()

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  it('should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      [field]: faker.word.sample(),
      [fieldToCompare]: faker.word.sample(),
    })

    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  it('Should return nothing if validation succeeds', () => {
    const sut = makeSut()
    const value = faker.word.sample()

    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value,
    })

    expect(error).toBeFalsy()
  })
})

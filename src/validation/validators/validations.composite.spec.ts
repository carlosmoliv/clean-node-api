import { MissingParamError } from '../../presentation/errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from '../../presentation/protocols'
import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/presentation/test'

const field = faker.word.sample()

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)

  return {
    sut,
    validationSpies,
  }
}

describe('ValidationComposite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[1].error = new MissingParamError(field)

    const error = sut.validate({ [field]: faker.word.sample() })

    expect(error).toEqual(validationSpies[1].error)
  })

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].error = new Error()
    validationSpies[1].error = new MissingParamError(field)

    const error = sut.validate({ [field]: faker.word.sample() })

    expect(error).toEqual(validationSpies[0].error)
  })

  it('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ [field]: faker.random.word() })

    expect(error).toBeFalsy()
  })
})

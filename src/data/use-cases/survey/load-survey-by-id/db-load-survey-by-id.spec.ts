import MockDate from 'mockdate'
import {
  LoadSurveyByIdRepository,
  SurveyModel,
} from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub,
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return a Survey on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.loadById('any_id')

    expect(surveys).toEqual(makeFakeSurvey())
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
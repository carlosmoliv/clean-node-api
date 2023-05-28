import { faker } from '@faker-js/faker'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey } from '@/domain/use-cases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      answer: faker.word.sample(),
    },
    {
      answer: faker.word.sample(),
      image: faker.image.url(),
    },
  ],
  date: faker.date.recent(),
})

export const mockSurveysModel = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel(),
]

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.word.words(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.word.sample(),
    },
    {
      answer: faker.word.sample(),
    },
  ],
  date: faker.date.recent(),
})

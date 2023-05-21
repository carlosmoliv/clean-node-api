import { faker } from '@faker-js/faker'
import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../use-cases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.string.uuid(),
  surveyId: faker.string.uuid(),
  answer: faker.word.sample(),
  date: faker.date.recent(),
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      answer: faker.word.sample(),
      count: faker.number.int({ min: 0, max: 1000 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
    {
      answer: faker.word.sample(),
      image: faker.image.url(),
      count: faker.number.int({ min: 0, max: 1000 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
  ],
  date: new Date(),
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      answer: faker.word.sample(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
    {
      answer: faker.word.sample(),
      image: faker.image.url(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
  date: faker.date.recent(),
})

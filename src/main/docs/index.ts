import { loginPath, signUpPath, surveyPath } from './paths'
import {
  badRequest,
  notFound,
  serverError,
  unauthorized,
  forbidden,
} from './components'
import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  apiKeyAuthSchema,
  signUpParamsSchema,
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: "Mango's Course API",
    version: '1.0.0',
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Survey',
    },
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden,
  },
}

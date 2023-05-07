import { loginPath } from './paths'
import { badRequest, notFound, serverError, unauthorized } from './components'
import { accountSchema, errorSchema, loginParamsSchema } from './schemas'

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
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound,
  },
}

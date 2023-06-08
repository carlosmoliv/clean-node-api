import { adaptResolver } from '@/main/adapters/express/apollo-server-resolver-adapter'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory'

export default {
  Query: {
    login: (parent: any, args: any) =>
      adaptResolver(makeLoginController(), args),
  },
}

export class ServerError extends Error {
  constructor(stack?: string) {
    super('Internal ServerError')

    this.name = 'ServerError'
    this.stack = stack
  }
}

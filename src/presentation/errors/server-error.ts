export class ServerError extends Error {
  constructor() {
    super('Internal ServerError')
    this.name = 'ServerError'
  }
}

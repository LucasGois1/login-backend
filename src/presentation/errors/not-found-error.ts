export class NotFoundError extends Error {
  constructor (content: string) {
    super(`Not found: ${content}`)
    this.name = 'NotFoundName'
  }
}

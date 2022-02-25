import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('valid_token'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter suite', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('valid_id')
    expect(signSpy).toHaveBeenCalledWith({
      id: 'valid_id'
    }, 'secret')
  })

  test('Should return a token on success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('valid_id')
    expect(accessToken).toBe('valid_token')
  })

  test('Should throws if jwt throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.encrypt('valid_id')
    await expect(promise).rejects.toThrow()
  })
})

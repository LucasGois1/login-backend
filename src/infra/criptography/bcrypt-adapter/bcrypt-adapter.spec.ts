import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => (resolve(true)))
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter()
}

describe('Hasher suite', () => {
  test('Should call bcrypt hash method with correct value',async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('password')
    expect(hashSpy).toHaveBeenCalledWith('password', 12)
  })
  test('Should return a hash on success',async () => {
    const sut = makeSut()

    const hashValue = await sut.hash('password')
    expect(hashValue).toBe('hash')
  })

  test('Should call bcrypt compare method with correct value',async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('password', 'hashed_password')
    expect(compareSpy).toHaveBeenCalledWith('password', 'hashed_password')
  })

  test('Should return true on success',async () => {
    const sut = makeSut()

    const isValid = await sut.compare('password', 'hashed_password')
    expect(isValid).toBeTruthy()
  })

  test('Should return false if compare fails',async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const isValid = await sut.compare('password', 'hashed_password')
    expect(isValid).toBeFalsy()
  })
  test('Should throws if hash throws',async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.hash('password')
    await expect(promise).rejects.toThrow()
  })

  test('Should throws if compare throws',async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.compare('password', 'hashed_password')
    await expect(promise).rejects.toThrow()
  })
})

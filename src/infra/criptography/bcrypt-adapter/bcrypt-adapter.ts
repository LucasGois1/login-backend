import { Hasher } from '../../../data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  async hash (value: string): Promise<string> {
    const hashed = bcrypt.hash(value, 12)
    return hashed
  }

  async compare (value: string, hashedValue: string): Promise<boolean> {
    const isValid = bcrypt.compare(value, hashedValue)
    return isValid
  }
}

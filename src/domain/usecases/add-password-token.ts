export interface AddPasswordTokenModel {
  email: string
  token: string
}

export interface AddPasswordToken {
  add: (account: AddPasswordTokenModel) => Promise<void>
}

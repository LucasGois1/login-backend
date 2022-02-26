export interface ChangePasswordModel {
  newPassword: string
  token: string
}

export interface ChangePassword {
  updatePassword: (changePassword: ChangePasswordModel) => Promise<boolean>
}

export interface UpdatePasswordRepository {
  updatePassword: (id: string, newPassword: string) => Promise<void>
}

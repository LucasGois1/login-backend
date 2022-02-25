export interface EmailVerifier {
  exist: (email: string) => Promise<boolean>
}

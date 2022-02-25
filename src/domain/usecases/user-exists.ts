export interface Verifier {
  exist: (email: string) => Promise<boolean>
}

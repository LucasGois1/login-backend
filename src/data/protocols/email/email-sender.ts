export default interface EmailSender {
  send: (subject: string, text: string, destinatary: string) => Promise<boolean>
}
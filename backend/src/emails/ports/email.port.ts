export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const EMAIL_PORT = Symbol('EMAIL_PORT');

export interface IEmailPort {
  sendEmail(options: SendEmailOptions, trx_trace_id: string | null): Promise<boolean>;
}

import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { IEmailPort, SendEmailOptions } from '../ports/email.port';
import { SecretManagerService } from '../../shared/services/secret-manager.service';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable()
export class ResendEmailAdapter implements IEmailPort {
  private resend: Resend;

  constructor(
    private secretManager: SecretManagerService,
    private logger: LoggerService,
  ) {
    const apiKey = this.secretManager.getOptional('RESEND_API_KEY');
    // Allow instantiation without API key for development if needed, but warn
    if (!apiKey) {
      this.logger.log('WARNING: RESEND_API_KEY is not set. Emails will not be sent.', null, null, null);
      this.resend = new Resend('dummy_key');
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(options: SendEmailOptions, trx_trace_id: string | null): Promise<boolean> {
    this.logger.log(`Sending email to ${options.to}`, null, trx_trace_id, null);
    
    try {
      const data = await this.resend.emails.send({
        from: 'Alejandra Valenzuela <hola@alejandravalenzuela.cl>', // Placeholder domain
        to: [options.to],
        subject: options.subject,
        html: options.html,
      });

      if (data.error) {
        this.logger.error(`Resend API Error: ${data.error.message}`, data.error.name, null, trx_trace_id, null);
        return false;
      }
      
      return true;
    } catch (e: any) {
      this.logger.error(`Failed to send email to ${options.to}`, e.stack, null, trx_trace_id, null);
      return false;
    }
  }
}

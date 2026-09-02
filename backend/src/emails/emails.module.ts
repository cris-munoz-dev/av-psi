import { Module } from '@nestjs/common';
import { EMAIL_PORT } from './ports/email.port';
import { ResendEmailAdapter } from './adapters/resend-email.adapter';

@Module({
  providers: [
    {
      provide: EMAIL_PORT,
      useClass: ResendEmailAdapter,
    },
  ],
  exports: [EMAIL_PORT],
})
export class EmailsModule {}

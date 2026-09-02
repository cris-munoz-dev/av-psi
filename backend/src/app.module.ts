import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { TraceIdMiddleware } from './shared/middlewares/trace-id.middleware';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { EmailsModule } from './emails/emails.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [SharedModule, AuthModule, SettingsModule, PatientsModule, AppointmentsModule, EmailsModule, WebhooksModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}

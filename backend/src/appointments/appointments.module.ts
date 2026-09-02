import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { SettingsModule } from '../settings/settings.module';
import { PatientsModule } from '../patients/patients.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [SettingsModule, PatientsModule, EmailsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

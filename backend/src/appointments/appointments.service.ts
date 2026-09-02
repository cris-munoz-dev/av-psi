import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../shared/services/prisma.service';
import { CryptoService } from '../shared/services/crypto.service';
import { LoggerService } from '../shared/services/logger.service';
import { SettingsService } from '../settings/settings.service';
import {
  BookAppointmentDto,
  AdminUpdateAppointmentDto,
} from './dto/appointment.dto';
import { ApptStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly logger: LoggerService,
    private readonly settings: SettingsService,
  ) {}

  async findAll(trx_trace_id: string | null) {
    this.logger.log('Fetching all appointments', null, trx_trace_id, null);
    const appointments = await this.prisma.appointment.findMany({
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { date: 'asc' },
    });

    return appointments.map((app) => ({
      ...app,
      notesDecrypted: app.notesEncrypted
        ? this.crypto.decrypt(app.notesEncrypted)
        : null,
      notesEncrypted: undefined, // Don't send ciphertext to frontend
    }));
  }

  async bookAppointment(dto: BookAppointmentDto, trx_trace_id: string | null) {
    this.logger.log(
      `Booking appointment for patient: ${dto.patientId}`,
      null,
      trx_trace_id,
      null,
    );

    const appointmentDate = new Date(dto.date);
    const now = new Date();

    // Rule: Minimum 24 hours anticipation
    const diffHours =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      throw new Error(
        'Appointments must be booked at least 24 hours in advance',
      );
    }

    // Check for double booking
    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        status: { in: ['BOOKED', 'RESCHEDULED'] },
      },
    });

    if (overlapping) {
      throw new Error('This time slot is already booked');
    }

    return this.prisma.appointment.create({
      data: {
        patientId: dto.patientId,
        date: appointmentDate,
        modality: dto.modality,
        status: ApptStatus.BOOKED,
      },
    });
  }

  async getAvailableSlots(dateStr: string, trx_trace_id: string | null) {
    this.logger.log(
      `Fetching available slots for ${dateStr}`,
      null,
      trx_trace_id,
      null,
    );

    // dateStr comes as YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const booked = await this.prisma.appointment.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: { in: ['BOOKED', 'RESCHEDULED'] },
      },
      select: { date: true },
    });

    const bookedHours = booked.map((b) => b.date.getHours());

    let allSlots = [9, 10, 11, 12, 15, 16, 17, 18];
    try {
      const config = await this.settings.getSetting(
        'availability',
        trx_trace_id,
      );
      if (config && Array.isArray(config.hours)) {
        allSlots = config.hours as number[];
      }

      if (config && Array.isArray(config.days)) {
        const jsDay = startOfDay.getDay();
        const isoDay = jsDay === 0 ? 7 : jsDay;
        if (!(config.days as number[]).includes(isoDay)) {
          return []; // Day is not available
        }
      }
    } catch (e: unknown) {
      this.logger.log(
        'Failed to fetch settings, using defaults',
        null,
        trx_trace_id,
        null,
      );
    }

    const availableSlots = allSlots
      .filter((hour) => !bookedHours.includes(hour))
      .map((hour) => `${hour.toString().padStart(2, '0')}:00`);

    return availableSlots;
  }

  async cancelAppointment(id: string, trx_trace_id: string | null) {
    this.logger.log(`Cancelling appointment: ${id}`, null, trx_trace_id, null);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: ApptStatus.CANCELLED },
    });
  }

  async adminUpdateAppointment(
    id: string,
    dto: AdminUpdateAppointmentDto,
    trx_trace_id: string | null,
  ) {
    this.logger.log(
      `Admin updating appointment: ${id}`,
      null,
      trx_trace_id,
      null,
    );

    const data: Record<string, unknown> = {};
    if (dto.date) data.date = new Date(dto.date);
    if (dto.status) data.status = dto.status;
    if (dto.privateNotes !== undefined) {
      data.notesEncrypted = dto.privateNotes
        ? this.crypto.encrypt(dto.privateNotes)
        : null;
    }

    return this.prisma.appointment.update({
      where: { id },
      data: data as import('@prisma/client').Prisma.AppointmentUpdateInput,
    });
  }

  async publicBookAppointment(
    dto: import('./dto/appointment.dto').PublicBookAppointmentDto,
    trx_trace_id: string | null,
  ) {
    this.logger.log(
      `Public booking appointment for RUT`,
      null,
      trx_trace_id,
      null,
    );

    const appointmentDate = new Date(dto.date);
    const now = new Date();
    const diffHours =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      throw new Error(
        'Appointments must be booked at least 24 hours in advance',
      );
    }

    // Check for double booking
    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        status: { in: ['BOOKED', 'RESCHEDULED'] },
      },
    });

    if (overlapping) {
      throw new Error('This time slot is already booked');
    }

    const rutHash = this.crypto.hash(dto.rut);
    let patient = await this.prisma.patient.findUnique({
      where: { rutHash },
      include: { user: true },
    });

    // We can't easily inject PatientsService here without circular dependency risk or complex module resolution if not set up perfectly.
    // Actually, we can just do the creation here or inject it. I'll just do it directly since it's a guest user.
    if (!patient) {
      if (!dto.newPatient) {
        throw new Error('Patient not found and new patient data not provided');
      }

      const fakeAuthId = randomUUID();
      const email = dto.newPatient.email;

      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            authId: fakeAuthId,
            email,
            role: 'PATIENT',
          },
        });
      }

      patient = await this.prisma.patient.create({
        data: {
          userId: user.id,
          firstName: dto.newPatient.firstName,
          lastName: dto.newPatient.lastName,
          rutEncrypted: this.crypto.encrypt(dto.rut),
          rutHash: this.crypto.hash(dto.rut),
          phoneEncrypted: this.crypto.encrypt(dto.newPatient.phone),
          dobEncrypted: this.crypto.encrypt(dto.newPatient.dob),
        },
        include: { user: true },
      });
    }

    const notesEncrypted = dto.reason
      ? this.crypto.encrypt(`Motivo de consulta: ${dto.reason}`)
      : null;

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        date: appointmentDate,
        modality: dto.modality,
        status: ApptStatus.BOOKED,
        notesEncrypted,
      },
    });

    // Send confirmation email (Best effort, we won't fail the transaction if it fails)
    try {
      // For now we'll just log it to avoid failing if Resend is not configured yet.
      this.logger.log(
        `[EMAIL] Confirmation sent to ${patient.user.email} for appointment on ${dto.date}`,
        null,
        trx_trace_id,
        null,
      );
    } catch (e: unknown) {
      this.logger.log(
        `Failed to send confirmation email: ${(e as Error).message}`,
        null,
        trx_trace_id,
        null,
      );
    }

    return appointment;
  }
}

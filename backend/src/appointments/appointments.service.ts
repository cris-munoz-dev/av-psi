import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CryptoService } from '../shared/services/crypto.service';
import { LoggerService } from '../shared/services/logger.service';
import { BookAppointmentDto, AdminUpdateAppointmentDto, RescheduleAppointmentDto } from './dto/appointment.dto';
import { ApptStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly logger: LoggerService,
  ) {}

  async bookAppointment(dto: BookAppointmentDto, trx_trace_id: string | null) {
    this.logger.log(`Booking appointment for patient: ${dto.patientId}`, null, trx_trace_id, null);
    
    const appointmentDate = new Date(dto.date);
    const now = new Date();
    
    // Rule: Minimum 24 hours anticipation
    const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      throw new Error('Appointments must be booked at least 24 hours in advance');
    }

    // Checking overlaps would go here in a real implementation (querying existing booked appointments)
    
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
    this.logger.log(`Fetching available slots for ${dateStr}`, null, trx_trace_id, null);
    // In a full implementation, this reads from Settings (available blocks) and filters out booked appointments.
    return [];
  }

  async cancelAppointment(id: string, trx_trace_id: string | null) {
    this.logger.log(`Cancelling appointment: ${id}`, null, trx_trace_id, null);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: ApptStatus.CANCELLED },
    });
  }

  async adminUpdateAppointment(id: string, dto: AdminUpdateAppointmentDto, trx_trace_id: string | null) {
    this.logger.log(`Admin updating appointment: ${id}`, null, trx_trace_id, null);
    
    const data: any = {};
    if (dto.date) data.date = new Date(dto.date);
    if (dto.status) data.status = dto.status;
    if (dto.privateNotes !== undefined) {
      data.notesEncrypted = dto.privateNotes ? this.crypto.encrypt(dto.privateNotes) : null;
    }

    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }
}

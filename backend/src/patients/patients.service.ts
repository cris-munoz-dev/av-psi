import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CryptoService } from '../shared/services/crypto.service';
import { LoggerService } from '../shared/services/logger.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { Patient } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreatePatientDto, trx_trace_id: string | null): Promise<Patient> {
    this.logger.log(`Creating patient for user: ${dto.userId}`, null, trx_trace_id, null);
    
    // Encrypt sensitive fields
    const rutEncrypted = this.crypto.encrypt(dto.rut);
    const phoneEncrypted = this.crypto.encrypt(dto.phone);
    const dobEncrypted = this.crypto.encrypt(dto.dob);
    const notesEncrypted = dto.privateNotes ? this.crypto.encrypt(dto.privateNotes) : null;

    return this.prisma.patient.create({
      data: {
        userId: dto.userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        rutEncrypted,
        phoneEncrypted,
        dobEncrypted,
        notesEncrypted,
      },
    });
  }

  async findAll(trx_trace_id: string | null) {
    this.logger.log('Fetching all patients', null, trx_trace_id, null);
    const patients = await this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Decrypt data before sending back to the trusted admin
    return patients.map(p => this.decryptPatient(p));
  }

  async findOne(id: string, trx_trace_id: string | null) {
    this.logger.log(`Fetching patient: ${id}`, null, trx_trace_id, null);
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { appointments: true }
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const decryptedPatient = this.decryptPatient(patient);
    // Appointments notes also need decryption, handled in Appointments Module mostly, but we can do it here for full view
    if (patient.appointments) {
      decryptedPatient.appointments = patient.appointments.map(a => ({
        ...a,
        notesDecrypted: a.notesEncrypted ? this.crypto.decrypt(a.notesEncrypted) : null,
      }));
    }

    return decryptedPatient;
  }

  private decryptPatient(patient: Patient): any {
    return {
      ...patient,
      rut: this.crypto.decrypt(patient.rutEncrypted),
      phone: this.crypto.decrypt(patient.phoneEncrypted),
      dob: this.crypto.decrypt(patient.dobEncrypted),
      privateNotes: patient.notesEncrypted ? this.crypto.decrypt(patient.notesEncrypted) : null,
    };
  }
}

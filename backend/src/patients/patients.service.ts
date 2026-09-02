import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CryptoService } from '../shared/services/crypto.service';
import { LoggerService } from '../shared/services/logger.service';
import { CreatePatientDto } from './dto/patient.dto';
import { Patient } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly logger: LoggerService,
  ) {}

  async create(
    dto: CreatePatientDto,
    trx_trace_id: string | null,
  ): Promise<Patient> {
    this.logger.log(
      `Creating patient manually for email: ${dto.email}`,
      null,
      trx_trace_id,
      null,
    );
    const fakeAuthId = randomUUID();
    return this.createProfile(fakeAuthId, dto.email, dto, trx_trace_id);
  }

  async findByUserId(authId: string, trx_trace_id: string | null) {
    this.logger.log(
      `Fetching patient by auth ID: ${authId}`,
      null,
      trx_trace_id,
      null,
    );

    const user = await this.prisma.user.findUnique({ where: { authId } });
    if (!user) return null;

    const patient = await this.prisma.patient.findFirst({
      where: { userId: user.id },
    });

    if (!patient) return null;
    return this.decryptPatient(patient);
  }

  async createProfile(
    authId: string,
    email: string,
    dto: Omit<CreatePatientDto, 'userId'>,
    trx_trace_id: string | null,
  ) {
    this.logger.log(
      `Creating profile for auth user: ${authId}`,
      null,
      trx_trace_id,
      null,
    );

    // Upsert User
    let user = await this.prisma.user.findUnique({ where: { authId } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          authId,
          email: email || `${authId}@placeholder.com`, // email is required by schema
          role: 'PATIENT',
        },
      });
    }

    // Encrypt sensitive fields
    const rutEncrypted = this.crypto.encrypt(dto.rut);
    const rutHash = this.crypto.hash(dto.rut);
    const phoneEncrypted = this.crypto.encrypt(dto.phone);
    const dobEncrypted = this.crypto.encrypt(dto.dob);
    const notesEncrypted = dto.privateNotes
      ? this.crypto.encrypt(dto.privateNotes)
      : null;

    return this.prisma.patient.create({
      data: {
        userId: user.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        rutEncrypted,
        rutHash,
        phoneEncrypted,
        dobEncrypted,
        notesEncrypted,
      },
    });
  }

  async checkRutExists(
    rut: string,
    trx_trace_id: string | null,
  ): Promise<boolean> {
    this.logger.log(`Checking if RUT exists`, null, trx_trace_id, null);
    const rutHash = this.crypto.hash(rut);
    const count = await this.prisma.patient.count({ where: { rutHash } });
    return count > 0;
  }

  async findAll(trx_trace_id: string | null) {
    this.logger.log('Fetching all patients', null, trx_trace_id, null);
    const patients = await this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Decrypt data before sending back to the trusted admin
    return patients.map((p) => this.decryptPatient(p));
  }

  async findOne(id: string, trx_trace_id: string | null) {
    this.logger.log(`Fetching patient: ${id}`, null, trx_trace_id, null);
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { appointments: true },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const decryptedPatient = this.decryptPatient(patient);
    // Appointments notes also need decryption, handled in Appointments Module mostly, but we can do it here for full view
    if (patient.appointments) {
      decryptedPatient.appointments = patient.appointments.map((a) => ({
        ...a,
        notesDecrypted: a.notesEncrypted
          ? this.crypto.decrypt(a.notesEncrypted)
          : null,
      }));
    }

    return decryptedPatient;
  }

  private decryptPatient(
    patient: Patient & { appointments?: unknown[] },
  ): Patient & Record<string, unknown> {
    return {
      ...patient,
      rut: this.crypto.decrypt(patient.rutEncrypted),
      phone: this.crypto.decrypt(patient.phoneEncrypted),
      dob: this.crypto.decrypt(patient.dobEncrypted),
      privateNotes: patient.notesEncrypted
        ? this.crypto.decrypt(patient.notesEncrypted)
        : null,
    };
  }
}

import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Modality, ApptStatus } from '@prisma/client';

export class BookAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsEnum(Modality)
  @IsNotEmpty()
  modality!: Modality;
}

export class RescheduleAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  newDate!: string;
}

export class AdminUpdateAppointmentDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(ApptStatus)
  @IsOptional()
  status?: ApptStatus;

  @IsString()
  @IsOptional()
  privateNotes?: string;
}

export class PublicBookAppointmentDto {
  @IsString()
  @IsNotEmpty()
  rut!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsEnum(Modality)
  @IsNotEmpty()
  modality!: Modality;

  @IsString()
  @IsOptional()
  reason?: string;

  // New patient data (required if RUT not found)
  @IsOptional()
  newPatient?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
  };
}

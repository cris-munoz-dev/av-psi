import { IsDateString, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
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

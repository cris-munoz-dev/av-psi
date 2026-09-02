import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  rut!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  dob!: string;

  @IsString()
  @IsOptional()
  privateNotes?: string;
}

export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  rut?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  privateNotes?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

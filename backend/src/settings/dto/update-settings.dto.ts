import { IsObject } from 'class-validator';

export class UpdateSettingsDto {
  @IsObject()
  value!: Record<string, any>; // Using definite assignment assertion ! as per constitution
}

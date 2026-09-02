import { IsObject } from 'class-validator';

export class UpdateSettingsDto {
  @IsObject()
  value!: Record<string, unknown>; // Using definite assignment assertion ! as per constitution
}

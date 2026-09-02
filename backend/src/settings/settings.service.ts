import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { LoggerService } from '../shared/services/logger.service';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  async getSetting(
    key: string,
    trx_trace_id: string | null,
  ): Promise<Record<string, unknown>> {
    this.logger.log(`Fetching setting: ${key}`, null, trx_trace_id, null);
    const setting = await this.prisma.settings.findUnique({
      where: { key },
    });

    if (!setting) {
      // Constitution dictates throwing domain/custom exceptions, but NotFoundException is often accepted in simple CRUD or we can define a custom one.
      // Let's use a standard error that the controller handles.
      throw new Error(`Setting ${key} not found`);
    }

    return JSON.parse(setting.value);
  }

  async updateSetting(
    key: string,
    value: Record<string, unknown>,
    trx_trace_id: string | null,
  ): Promise<void> {
    this.logger.log(`Updating setting: ${key}`, null, trx_trace_id, null);
    const stringValue = JSON.stringify(value);

    await this.prisma.settings.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });
  }
}

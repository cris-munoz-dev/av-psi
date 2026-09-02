import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

import { Roles } from '../auth/roles.decorator';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  @Roles('PUBLIC')
  async getSetting(@Param('key') key: string, @Req() req: RequestWithTrace) {
    try {
      return await this.settingsService.getSetting(
        key,
        req.trx_trace_id || null,
      );
    } catch (e: unknown) {
      const msg = (e as Error).message;
      if (msg.includes('not found')) {
        throw new NotFoundException(msg);
      }
      throw new BadRequestException(msg);
    }
  }

  @Put(':key')
  @Roles('ADMIN')
  async updateSetting(
    @Param('key') key: string,
    @Body() dto: UpdateSettingsDto,
    @Req() req: RequestWithTrace,
  ) {
    try {
      await this.settingsService.updateSetting(
        key,
        dto.value,
        req.trx_trace_id || null,
      );
      return { success: true };
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }
}

import { Controller, Get, Put, Param, Body, Req, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  async getSetting(@Param('key') key: string, @Req() req: RequestWithTrace) {
    try {
      return await this.settingsService.getSetting(key, req.trx_trace_id || null);
    } catch (e: any) {
      if (e.message.includes('not found')) {
        throw new NotFoundException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @Put(':key')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateSetting(
    @Param('key') key: string,
    @Body() dto: UpdateSettingsDto,
    @Req() req: RequestWithTrace,
  ) {
    try {
      await this.settingsService.updateSetting(key, dto.value, req.trx_trace_id || null);
      return { success: true };
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}

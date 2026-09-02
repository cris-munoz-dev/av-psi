import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  BookAppointmentDto,
  AdminUpdateAppointmentDto,
} from './dto/appointment.dto';

import { Roles } from '../auth/roles.decorator';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('available')
  @Roles('PUBLIC')
  async getAvailableSlots(
    @Query('date') date: string,
    @Req() req: RequestWithTrace,
  ) {
    return this.appointmentsService.getAvailableSlots(
      date,
      req.trx_trace_id || null,
    );
  }

  @Get()
  @Roles('ADMIN')
  async findAll(@Req() req: RequestWithTrace) {
    return this.appointmentsService.findAll(req.trx_trace_id || null);
  }

  @Post('public-book')
  @Roles('PUBLIC')
  async publicBook(
    @Body() dto: import('./dto/appointment.dto').PublicBookAppointmentDto,
    @Req() req: RequestWithTrace,
  ) {
    try {
      return await this.appointmentsService.publicBookAppointment(
        dto,
        req.trx_trace_id || null,
      );
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Post('book')
  @Roles('PATIENT', 'ADMIN')
  async book(@Body() dto: BookAppointmentDto, @Req() req: RequestWithTrace) {
    try {
      return await this.appointmentsService.bookAppointment(
        dto,
        req.trx_trace_id || null,
      );
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Put(':id/cancel')
  @Roles('PATIENT', 'ADMIN')
  async cancel(@Param('id') id: string, @Req() req: RequestWithTrace) {
    try {
      return await this.appointmentsService.cancelAppointment(
        id,
        req.trx_trace_id || null,
      );
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Put(':id/admin')
  @Roles('ADMIN')
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateAppointmentDto,
    @Req() req: RequestWithTrace,
  ) {
    try {
      return await this.appointmentsService.adminUpdateAppointment(
        id,
        dto,
        req.trx_trace_id || null,
      );
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }
}

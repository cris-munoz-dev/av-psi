import { Controller, Post, Get, Put, Param, Body, Req, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { BookAppointmentDto, AdminUpdateAppointmentDto, RescheduleAppointmentDto } from './dto/appointment.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('available')
  async getAvailableSlots(@Query('date') date: string, @Req() req: RequestWithTrace) {
    return this.appointmentsService.getAvailableSlots(date, req.trx_trace_id || null);
  }

  @Post('book')
  @UseGuards(RolesGuard)
  @Roles('PATIENT', 'ADMIN')
  async book(@Body() dto: BookAppointmentDto, @Req() req: RequestWithTrace) {
    try {
      return await this.appointmentsService.bookAppointment(dto, req.trx_trace_id || null);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Put(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('PATIENT', 'ADMIN')
  async cancel(@Param('id') id: string, @Req() req: RequestWithTrace) {
    try {
      return await this.appointmentsService.cancelAppointment(id, req.trx_trace_id || null);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Put(':id/admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateAppointmentDto,
    @Req() req: RequestWithTrace,
  ) {
    try {
      return await this.appointmentsService.adminUpdateAppointment(id, dto, req.trx_trace_id || null);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}

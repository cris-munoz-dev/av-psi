import { Controller, Get, Post, Body, Param, Req, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/patient.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';

@Controller('patients')
@UseGuards(RolesGuard)
@Roles('ADMIN') // All patient records are strictly admin only
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() dto: CreatePatientDto, @Req() req: RequestWithTrace) {
    try {
      const patient = await this.patientsService.create(dto, req.trx_trace_id || null);
      return { success: true, id: patient.id };
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  async findAll(@Req() req: RequestWithTrace) {
    return this.patientsService.findAll(req.trx_trace_id || null);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithTrace) {
    try {
      return await this.patientsService.findOne(id, req.trx_trace_id || null);
    } catch (e: any) {
      throw new NotFoundException(e.message);
    }
  }
}

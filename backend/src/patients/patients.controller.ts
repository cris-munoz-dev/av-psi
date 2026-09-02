import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/patient.dto';

import { Roles } from '../auth/roles.decorator';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';

@Controller('patients')
@Roles('ADMIN') // All patient records are strictly admin only
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('check-rut')
  @Roles('PUBLIC')
  async checkRut(@Body('rut') rut: string, @Req() req: RequestWithTrace) {
    if (!rut) throw new BadRequestException('RUT is required');
    try {
      const exists = await this.patientsService.checkRutExists(
        rut,
        req.trx_trace_id || null,
      );
      return { exists };
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Post()
  async create(@Body() dto: CreatePatientDto, @Req() req: RequestWithTrace) {
    try {
      const patient = await this.patientsService.create(
        dto,
        req.trx_trace_id || null,
      );
      return { success: true, id: patient.id };
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Get('me')
  @Roles('PATIENT', 'ADMIN')
  async getMyProfile(
    @Req() req: RequestWithTrace & { user?: { sub?: string } },
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new BadRequestException('User not authenticated');

    try {
      const patient = await this.patientsService.findByUserId(
        userId,
        req.trx_trace_id || null,
      );
      if (!patient) throw new NotFoundException('Profile not found');
      return patient;
    } catch (e: unknown) {
      throw new NotFoundException((e as Error).message);
    }
  }

  @Post('me')
  @Roles('PATIENT', 'ADMIN')
  async createMyProfile(
    @Body() dto: CreatePatientDto,
    @Req() req: RequestWithTrace & { user?: { sub?: string; email?: string } },
  ) {
    const authId = req.user?.sub;
    const email = req.user?.email || dto.email || '';
    if (!authId) throw new BadRequestException('User not authenticated');

    try {
      const patient = await this.patientsService.createProfile(
        authId,
        email,
        dto,
        req.trx_trace_id || null,
      );
      return { success: true, id: patient.id };
    } catch (e: unknown) {
      throw new BadRequestException((e as Error).message);
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
    } catch (e: unknown) {
      throw new NotFoundException((e as Error).message);
    }
  }
}

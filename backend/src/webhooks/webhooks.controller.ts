import { Controller, Post, Headers, UnauthorizedException, Req } from '@nestjs/common';
import { RequestWithTrace } from '../shared/middlewares/trace-id.middleware';
import { LoggerService } from '../shared/services/logger.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly logger: LoggerService) {}

  @Post('reminders')
  async triggerReminders(
    @Headers('authorization') authHeader: string,
    @Req() req: RequestWithTrace,
  ) {
    // This endpoint should be protected by a hardcoded cron secret so only Supabase pg_cron can call it
    const cronSecret = process.env.CRON_SECRET || 'dev_cron_secret';
    if (authHeader !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid cron secret');
    }

    this.logger.log('Triggering 24h appointment reminders via pg_cron', null, req.trx_trace_id || null, null);

    // 1. Query appointments exactly 24h from now (status BOOKED)
    // 2. Map patient IDs to emails
    // 3. Inject IEmailPort and send reminders
    
    return { success: true };
  }
}

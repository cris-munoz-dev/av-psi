import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('App');

  log(
    message: string | object,
    country: string | null,
    trx_trace_id: string | null,
    process_trace_id: string | null,
  ): void {
    const payload = {
      message,
      country,
      trx_trace_id,
      process_trace_id,
      timestamp: new Date().toISOString(),
    };
    
    // According to CONSTITUTION.md: no direct console.log in production.
    // We use NestJS built-in Logger which can be configured to write to stdout or cloud logging in JSON
    this.logger.log(JSON.stringify(payload));
  }

  error(
    message: string | object,
    trace: string,
    country: string | null,
    trx_trace_id: string | null,
    process_trace_id: string | null,
  ): void {
    const payload = {
      message,
      trace,
      country,
      trx_trace_id,
      process_trace_id,
      timestamp: new Date().toISOString(),
    };
    this.logger.error(JSON.stringify(payload));
  }
}

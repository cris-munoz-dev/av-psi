import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithTrace extends Request {
  trx_trace_id?: string;
}

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: RequestWithTrace, res: Response, next: NextFunction) {
    // Generate a unique transaction trace ID for every request as mandated by CONSTITUTION.md
    req.trx_trace_id = uuidv4();
    next();
  }
}

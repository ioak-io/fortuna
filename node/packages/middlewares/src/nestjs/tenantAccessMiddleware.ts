import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantAccess } from '../auth';

@Injectable()
export class TenantAccessMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    tenantAccess(req, res, next);
  }
}

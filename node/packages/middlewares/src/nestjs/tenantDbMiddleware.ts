import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantDb } from '../tenantDb';

@Injectable()
export class TenantDbMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    tenantDb(req, res, next);
  }
}

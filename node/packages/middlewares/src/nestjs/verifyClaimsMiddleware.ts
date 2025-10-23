import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyAndGetClaims } from '../jwt';

@Injectable()
export class VerifyClaimsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    verifyAndGetClaims(req, res, next);
  }
}

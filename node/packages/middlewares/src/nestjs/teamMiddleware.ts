import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TeamMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract team from x-team header
    const team = req.headers['x-team'] as string;

    if (!team) {
      return res.status(400).send('Missing x-team header');
    }

    // Attach team to request object
    req.team = team;
    next();
  }
}

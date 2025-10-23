import { Request, Response, NextFunction, RequestHandler } from 'express';

export const tenantAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.claims?.resource_access?.[req.realm]?.roles?.some(item => item.startsWith(req.tenant))) {
    res.status(403).send(`Permission denied for tenant "${req.tenant}"`);
  } else {
    next();
  }
};

export const tenantAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.claims?.resource_access?.["realm-management"]?.roles?.includes('realm-admin')) {
    next();
  } else {
    res.status(403).send(`Admin permission denied for tenant "${req.tenant}"`);
  }
};

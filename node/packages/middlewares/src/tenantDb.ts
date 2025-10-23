import { Request, Response, NextFunction } from "express";

/**
 * Middleware: Attach tenant-specific DB instance to the request
 */
export function tenantDb(req: Request, res: Response, next: NextFunction) {
  // realm comes from verified token claims
  const iss: string | undefined = (req.claims as any)?.iss;
  const match = iss?.match(/\/realms\/([^/]+)$/);
  const realm = match ? match[1] : null;

  // tenant is expected as a header
  const tenant = req.headers["x-tenant"] as string;

  if (!realm || !tenant) {
    return res.status(400).send("Missing tenant info");
  }

  req.realm = realm;
  req.tenant = tenant;
  next();
}

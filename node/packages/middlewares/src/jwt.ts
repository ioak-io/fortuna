import { Request, Response, NextFunction } from "express";
import jwt, { JwtHeader } from "jsonwebtoken";
import jwksClient, { JwksClient } from "jwks-rsa";
import { JwtClaims } from "./types";

const clients: Record<string, JwksClient> = {};

/**
 * Get or create a JWKS client for a given realm
 */
function getJwksClient(realm: string): JwksClient {
  if (!clients[realm]) {
    clients[realm] = jwksClient({
      jwksUri: `${process.env.KEYCLOAK_URL}/realms/${realm}/protocol/openid-connect/certs`,
    });
  }
  return clients[realm];
}

/**
 * Create a key resolver for a given realm
 */
function getKey(realm: string) {
  return (header: JwtHeader, callback: (err: Error | null, key?: string) => void) => {
    const client = getJwksClient(realm);
    if (!header.kid) return callback(new Error("No kid found in token header"));

    client.getSigningKey(header.kid, (err, key) => {
      if (err) return callback(err);
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  };
}

/**
 * Extract realm name from the token's `iss` claim
 */
function extractRealmFromToken(token: string): string | null {
  const decoded = jwt.decode(token) as { [key: string]: any } | null;
  const iss: string | undefined = decoded?.iss;
  if (!iss) return null;

  const match = iss.match(/\/realms\/([^/]+)$/);
  return match ? match[1] : null;
}

/**
 * Middleware: Verify JWT signature + claims using realm-specific JWKS
 */
export function verifyAndGetClaims(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid Authorization header format" });

  const realm = extractRealmFromToken(token);
  if (!realm) return res.status(400).json({ error: "Could not extract realm from token" });

  const issuer = `${process.env.KEYCLOAK_URL}/realms/${realm}`;
  const audience = "account";

  console.log(issuer, getKey(realm))

  jwt.verify(token, getKey(realm), {
    algorithms: ["RS256"],
    issuer, audience
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token", details: err.message });
    }
    req.claims = decoded as JwtClaims;
    next();
  });
}

/**
 * Middleware: Just decode the JWT without verifying (trust external proxy did verification)
 */
export function getClaims(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid Authorization header format" });

  try {
    const decoded = jwt.decode(token);
    if (!decoded) return res.status(400).json({ error: "Failed to decode JWT" });

    req.claims = decoded as JwtClaims;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Error decoding token",
      details: (err as Error).message,
    });
  }
}

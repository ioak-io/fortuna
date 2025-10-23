import { client } from "@fortuna/db-mongo";
import { JwtClaims } from "../JwtClaimTypes";

declare global {
  namespace Express {
    interface Request {
      claims: JwtClaims;
      realm: string;
      tenant: string;
      team: string;
    }
  }
}

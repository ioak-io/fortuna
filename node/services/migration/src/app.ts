import express, { Application } from 'express';
import cors from 'cors';
import tenantRouter from './routes/tenant';
import { getClaims, requestId, tenantAccess, tenantDb, verifyAndGetClaims } from '@fortuna/middlewares';

export function createApp(): Application {
  const app = express();

  app.use(express.json({ limit: 5000000 }));
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
    })
  );


  app.use(requestId);
  app.use(getClaims);
  app.use(tenantDb);
  // app.use(tenantAccess);

  app.use('/', tenantRouter);

  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Error:", err);
    res.status(500).send(
      process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.stack
    );
  });

  return app;
}

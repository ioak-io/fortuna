import { createApp } from './app';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

async function bootstrap() {
  const app = createApp();
  const PORT = process.env.PORT || 2110;

  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Tenant Gateway API',
        version: '1.0.0',
        description: 'API documentation for Tenant Gateway Service',
      },
    },
    apis: [path.join(__dirname, 'routes', '**', '*.ts')],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use((_: any, res: any) => {
    res.status(404).send("Not found").end();
  });

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to bootstrap server:", err);
  process.exit(1);
});

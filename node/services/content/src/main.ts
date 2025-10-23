import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Set global prefix
  app.setGlobalPrefix('');

  const port = process.env.PORT || 2111;
  await app.listen(port);
  
  console.log(`Content service is running on port ${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to bootstrap server:', err);
  process.exit(1);
});

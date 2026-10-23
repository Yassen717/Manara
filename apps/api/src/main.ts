import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: [/^http:\/\/(localhost|127\.0\.0\.1):\d+$/], credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Manara GaaS API')
    .setDescription(
      'Libya Government-as-a-Service citizen API. Currently backed by mock providers; ' +
      'every module is a seam where a real ministry system can be integrated later.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);

  const port = process.env.PORT ? Number(process.env.PORT) : 24020;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Manara API listening on http://localhost:${port}/api/v1 - Swagger at http://localhost:${port}/api/docs`);
}
bootstrap();

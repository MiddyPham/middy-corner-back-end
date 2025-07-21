// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.CLIENT_URL,
      process.env.GOOGLE_URL,
      process.env.GOOGLE_API_URL,
      process.env.VITE_PREVIEW,
      process.env.VITE_PORT,
      process.env.CLIENT_URL_LOCAL,
      process.env.SERVER_URL_LOCAL,
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Middy Corner API')
    .setDescription('API documentation for Middy Corner blog application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('posts', 'Blog posts endpoints')
    .addTag('comments', 'Comments endpoints')
    .addTag('reactions', 'Reactions endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use('/api-json', (req, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  const port = process.env.PORT || 8001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI available at: http://localhost:${port}/api`);
  console.log(
    `📄 OpenAPI JSON available at: http://localhost:${port}/api-json`,
  );
}
bootstrap();

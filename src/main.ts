import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Enable CORS
  app.enableCors();

  // Global validation — auto-validates all DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       
    forbidNonWhitelisted: true,
    transform: true,       
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('career sync API')
    .setDescription('career sync API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`career sync Backend running on http://localhost:3000`);
  console.log(`Swagger docs at http://localhost:3000/api/docs`);
}
bootstrap();
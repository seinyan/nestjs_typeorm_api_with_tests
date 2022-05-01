import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';

export function AppConfigureFunc(app: INestApplication) {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppConfigureFunc(app);

  const config = new DocumentBuilder()
    .setTitle('Api')
    .setDescription('API description')
    .setVersion('0.1')
    .addTag('Api')
    .setVersion('0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const port = parseInt(process.env.PORT) | 3000;
  await app.listen(port);
}
bootstrap();

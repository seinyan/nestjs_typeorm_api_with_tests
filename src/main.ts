import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigure } from './app-configure';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppConfigure(app);

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

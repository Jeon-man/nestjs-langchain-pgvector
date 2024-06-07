import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true, exposeDefaultValues: true },
      enableDebugMessages: true,
      whitelist: true,
    }),
  );

  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.get('APP_NAME'))
    .setDescription(`${config.get('APP_NAME')} Api description`)
    .setVersion('1.0')
    .addTag('general')
    .addTag('pdf')
    .addTag('chat')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        syntaxHighlight: {
          activate: true,
          theme: 'nord',
        },
      },
      customJs: 'https://cdn.flarelane.com/WebSDK.js',
      customJsStr: `FlareLane.initialize({ projectId: "c95fa7be-3d99-4d6f-8054-1cac6c3ed05a" });`,
    },
  });

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './products/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const logger: Logger = new Logger('Main');
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true
//     })
//   )
//   await app.listen(envs.port);
//   logger.log(`Server running on port ${envs.port}`);
// }
// bootstrap();


async function bootstrap() {
  const logger: Logger = new Logger('Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen();

  logger.log(`Server running on port ${envs.port}`);
}
bootstrap();

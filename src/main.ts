import { Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: { enableImplicitConversion: true }, // Enable implicit type conversion
      exceptionFactory(errors) {
        return new UnprocessableEntityException(
          errors.map((err) => ({
            property: err.property,
            constraints: Object.values(err.constraints ?? {}).join(', '),
          })),
        );
      },
    }),
  );
  const port = parseInt(process.env.PORT ?? '3000');
  await app.listen(port);
  const server = app.getHttpServer() as Server;
  const address = server.address() as AddressInfo | string;
  const host = typeof address === 'string' ? address : address.address;
  const actualHost = host === '::' || host === '0.0.0.0' ? 'localhost' : host;
  Logger.log(`🚀 Application is running on: http://${actualHost}:${port}`, 'Bootstrap');
}
bootstrap();

import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthModule } from './routes/auth/auth.module';
import { PostsModule } from './routes/posts/posts.module';
import { HashingService } from './shared/services/hashing.service';
import { SharedModule } from './shared/shared.module';

const service = [HashingService, AppService];

@Module({
  imports: [AuthModule, SharedModule, PostsModule, AuthModule],
  controllers: [AuthController, AppController],
  providers: [
    ...service,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}

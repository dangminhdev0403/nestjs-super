import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthModule } from './routes/auth/auth.module';
import { PostsModule } from './routes/posts/posts.module';
import { HashingService } from './shared/services/hashing.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, SharedModule, PostsModule, AuthModule],
  controllers: [AuthController, AppController],
  providers: [HashingService, AppService],
})
export class AppModule {}

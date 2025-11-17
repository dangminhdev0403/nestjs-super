import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { PrismaService } from './services/prisma.service';

const sharedServices = [PrismaService, HashingService, TokenService];
@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}

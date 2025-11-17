/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoginBodyDTO } from 'src/routes/auth/auth.dto';
import { isUniqueConstraintError } from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async registerUser(body: any) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          password: false,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new UnauthorizedException('Bad credentials');
    }
    const isPasswordValid = await this.hashingService.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Bad credentials');
    }
    const tokens = this.generateTokens({ userId: user.id });
    return tokens;
  }
  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId: payload.userId }),
      this.tokenService.signRefreshToken({ userId: payload.userId }),
    ]);
    const decodedRefresh = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: decodedRefresh.userId,
        createdAt: new Date(decodedRefresh.iat * 1000),
        updatedAt: new Date(decodedRefresh.exp * 1000),
      },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(oldRefreshToken);
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: { token: oldRefreshToken },
      });
      await this.prismaService.refreshToken.delete({
        where: {
          token: oldRefreshToken,
        },
      });
      return this.generateTokens({ userId });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

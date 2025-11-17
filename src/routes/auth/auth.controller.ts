/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { RegisterBodyDTO, RegisterResDTO } from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async registerUser(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.registerUser(body);
    return result;
  }
}

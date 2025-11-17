import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { Match } from 'src/shared/decorators/custom-validator.decorator';
import { SuccesResDTO } from 'src/shared/shared.dto';

export class LoginBodyDTO {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
export class LoginResDTO {
  accessToken: string;
  refreshToken: string;
  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial);
  }
}

export class ResfreshTokenBodyDTO {
  @IsString()
  refreshToken: string;
}
export class RefreshToken extends LoginResDTO {}
export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string;
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}

export class RegisterResData {
  id: number;
  email: string;
  name: string | null;
  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial: Partial<RegisterResData>) {
    Object.assign(this, partial);
  }
}

export class RegisterResDTO extends SuccesResDTO {
  declare data: RegisterResData;
  constructor(partial: Partial<RegisterResDTO>) {
    super(partial);
    Object.assign(this, partial);
  }
}

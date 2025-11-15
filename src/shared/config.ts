import { plainToInstance } from 'class-transformer';
import { IsString, validateSync, ValidationError } from 'class-validator';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

if (!fs.existsSync(path.resolve('.env'))) {
  throw new Error('.env file is missing. Please create one based on .env.example');
}

config({ path: '.env' });

class ConfigShchema {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;
}
class EnvValidationError extends Error {
  errors: {
    property: string;
    constraints: Record<string, string>;
    value: any;
  }[];

  constructor(errors: ValidationError[]) {
    super('Environment variable validation failed');
    this.name = 'EnvValidationError';

    this.errors = errors.map((err: ValidationError) => ({
      property: err.property,
      constraints: err.constraints ?? {},
      value: err.value,
    }));
  }
}

const configServer = plainToInstance(ConfigShchema, process.env, {
  enableImplicitConversion: true,
});

const validationErrors: ValidationError[] = validateSync(configServer);

if (validationErrors.length > 0) {
  throw new EnvValidationError(validationErrors);
}

export const envConfig = configServer;

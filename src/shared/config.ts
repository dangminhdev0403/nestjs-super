// check exit file .env
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
if (!fs.existsSync(path.resolve('.env'))) {
  throw new Error('.env file is missing. Please create one based on .env.example');
}

config({
  path: '.env',
});
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
const configServer = plainToInstance(ConfigShchema, process.env);
const e = validateSync(configServer);
if (e.length > 0) {
  console.log('valiable in file .env is invalid');
  const errors = e.map((err) => ({
    property: err.property,
    constraints: err.constraints,
    value: err.value,
  }));
  throw errors;
}
export const envConfig = configServer;

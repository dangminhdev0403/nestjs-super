/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
https://docs.nestjs.com/providers#services
*/
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
const saltRoutes = 10;
@Injectable()
export class HashingService {
  hash(value: string) {
    return hash(value, saltRoutes);
  }
  compare(value: string, hashedValue: string) {
    return this.compare(value, hashedValue);
  }
}

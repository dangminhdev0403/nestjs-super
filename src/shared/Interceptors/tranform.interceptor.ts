/*
https://docs.nestjs.com/interceptors#interceptors
*/

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TranformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const statusCode = ctx.getResponse().statusCode;
        return {
          statusCode,
          data,
        };
      }),
    );
  }
}

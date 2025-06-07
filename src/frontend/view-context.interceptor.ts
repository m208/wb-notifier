import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { dashBoardRouteValues } from 'src/constants/dashboardRoutes';

@Injectable()
export class ViewContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((originalData) => {
        return {
          ...originalData,
          nav: dashBoardRouteValues,
        };
      }),
    );
  }
}

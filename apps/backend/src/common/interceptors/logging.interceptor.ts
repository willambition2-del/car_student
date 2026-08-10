import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, path } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const requestId = uuidv4();
    request.headers['x-request-id'] = requestId;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const contentLength = response.get('content-length') || 0;
        const duration = Date.now() - now;

        this.logger.log(
          `[${requestId}] ${method} ${path} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${duration}ms`,
        );
      }),
    );
  }
}

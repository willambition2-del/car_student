import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'حدث خطأ داخلي في الخادم';
    let details = null;

    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        details = (exceptionResponse as any).error || details;
      }
    }

    const candidateRequestId = request.headers['x-request-id'];
    const requestId =
      typeof candidateRequestId === 'string' &&
      /^[a-zA-Z0-9_-]{8,64}$/.test(candidateRequestId)
        ? candidateRequestId
        : uuidv4();

    const errorResponse = {
      success: false,
      error: {
        code: status,
        message: Array.isArray(message) ? message[0] : message,
        details: Array.isArray(message) ? message : details,
      },
      timestamp: new Date().toISOString(),
      path: request.path,
      requestId,
    };

    // Log the error
    if (status >= 500) {
      this.logger.error(
        `[${requestId}] ${request.method} ${request.path} - ${status} - ${exception instanceof Error ? exception.message : 'Unknown Error'}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${request.method} ${request.path} - ${status} - ${Array.isArray(message) ? message.join(', ') : message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}

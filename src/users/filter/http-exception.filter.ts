// Nest comes with a built-in exceptions layer which is responsible for processing all unhandled exceptions across an application.
// When an exception is not handled by your application code,
// it is caught by this layer, which then automatically sends an appropriate user-friendly response.

// Exception Filters are called after the route handler and after the interceptors. They are the last place to make changes before a response goes out.

// Use Cases:
// to catch exceptions such as HttpException, RpcExceptions, etc.

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

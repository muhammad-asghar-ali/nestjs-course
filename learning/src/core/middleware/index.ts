// Middleware is a function that is called before the route handler.
// Middleware functions have access to the request and response objects, and the next() middleware function in the application’s request-response cycle.

// Use Cases
// to manipulate request and response

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request....');

    next();
  }
}

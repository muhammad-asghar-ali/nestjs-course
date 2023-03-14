// An interceptor is a class annotated with the @Injectable() decorator and implements the NestInterceptor interface.
// Interceptors have a set of useful capabilities which are inspired by the Aspect Oriented Programming (AOP) technique. They make it possible to:

// Use Cases
// bind extra logic before / after method execution
// transform the result returned from a function
// transform the exception thrown from a function
// extend the basic function behavior
// completely override a function depending on specific conditions (e.g., for caching purposes)

// basic interceptor
// Interceptors intercept the route before and after its handler gets called.
// This means, that you can manipulate the request and response to bind extra logic, transform the result, etc.

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // ExecutionContext: Interface describing details about the current request pipeline.
  // CallHandler: Interface providing access to the response stream.
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle() // Returns an Observable representing the response stream from the route handler.
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`))); // tap() operator, which invokes our anonymous logging function upon graceful or exceptional termination of the observable stream, but doesn't otherwise interfere with the response cycle.
  }
}

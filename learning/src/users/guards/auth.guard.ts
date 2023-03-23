/* eslint-disable @typescript-eslint/no-unused-vars */
// Guards have a single responsibility. They determine whether a given request will be handled by the route handler or not,
// depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time.
// This is often referred to as authorization.

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
/**
 * CanActivate: Interface defining the canActivate() function that must be implemented by a guard. Return value indicates whether or not the current request is allowed to proceed. Return can be either synchronous (boolean) or asynchronous (Promise or Observable).
 */
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  /**
   *
   * @param req
   * @returns
   */
  // Observable: A representation of any set of values over any amount of time. This is the most basic building block of RxJS.
  public validateRequest(req: Request): Promise<any> | any | Observable<any> {
    return Promise.resolve(Boolean);
  }
}

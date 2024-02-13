import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserReqData } from '../interface/user-req-data/user-req-data.interface';
import { IS_PUBLIC_KEY } from '../constant/customdecorator';

/**
 * Guard that implements CanActivate interface to handle authentication and authorization logic.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Determines if the route can be activated based on authentication and authorization rules.
   * @param context - The execution context of the route.
   * @returns A promise that resolves to a boolean indicating if the route can be activated.
   * @throws UnauthorizedException if the route is not public and the user is not authenticated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserReqData = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the token from the authorization header of the request.
   * @param request - The HTTP request object.
   * @returns The extracted token or undefined if not found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

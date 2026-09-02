import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Let it bypass JWT check if PUBLIC is allowed
    if (requiredRoles && requiredRoles.includes('PUBLIC')) {
      return true;
    }
    
    // Debug token header
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      try {
        const decoded = require('jsonwebtoken').decode(token, { complete: true });
        console.log('Token Header:', decoded?.header);
      } catch (e) {}
    }

    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest<TUser = unknown>(err: unknown, user: unknown, info: unknown): TUser {
    if (err || !user) {
      console.error('JwtAuthGuard failed. Error:', err, 'User:', user, 'Info:', info);
      throw err || new UnauthorizedException('Invalid or missing authentication token');
    }
    return user as TUser;
  }
}

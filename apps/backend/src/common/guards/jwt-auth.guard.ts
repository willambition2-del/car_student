import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('غير مصرح لك بالوصول');
    }
    
    // Check if the user is forced to change their password
    if (user.mustChangePassword) {
      const { SKIP_PASSWORD_CHANGE_KEY } = require('../decorators/skip-password-change.decorator');
      const skipCheck = this.reflector.getAllAndOverride<boolean>(SKIP_PASSWORD_CHANGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      if (!skipCheck) {
        throw new ForbiddenException('يجب تغيير كلمة المرور قبل المتابعة');
      }
    }
    
    return user;
  }
}

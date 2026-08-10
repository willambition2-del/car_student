import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class PlatformOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('غير مصرح لك بالوصول');
    }

    if (user.userType !== 'platform') {
      throw new ForbiddenException('هذه الصفحة مخصصة لمديري المنصة فقط');
    }

    return true;
  }
}

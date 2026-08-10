import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class SchoolContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('غير مصرح لك بالوصول');
    }

    // Platform access to tenant endpoints requires an explicit, audited
    // impersonation flow. No such flow exists yet, so fail closed here.
    if (user.userType !== 'school') {
      throw new ForbiddenException(
        'This endpoint is restricted to school users',
      );
    }

    // School users must have a schoolId
    if (!user.schoolId) {
      throw new ForbiddenException('يجب تحديد المدرسة للقيام بهذا الإجراء');
    }

    // STRICT TENANT ISOLATION:
    // Ensure that if the client sends a schoolId in params, query, or body, it MATCHES the user's schoolId.
    // Better yet, the backend controllers should IGNORE these and use req.user.schoolId directly.
    const paramsSchoolId = request.params.schoolId;
    const querySchoolId = request.query.schoolId;
    const bodySchoolId = request.body?.schoolId;

    if (paramsSchoolId && paramsSchoolId !== user.schoolId) {
      throw new ForbiddenException(
        'ليس لديك صلاحية للوصول إلى بيانات هذه المدرسة',
      );
    }
    if (querySchoolId && querySchoolId !== user.schoolId) {
      throw new ForbiddenException(
        'ليس لديك صلاحية للوصول إلى بيانات هذه المدرسة',
      );
    }
    if (bodySchoolId && bodySchoolId !== user.schoolId) {
      throw new ForbiddenException(
        'ليس لديك صلاحية للوصول إلى بيانات هذه المدرسة',
      );
    }

    // We can also actively inject it into the request for easier access,
    // but req.user.schoolId is already present.
    return true;
  }
}

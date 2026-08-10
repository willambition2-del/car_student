import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { SchoolContextGuard } from './school-context.guard';
import { SchoolRoleEnum } from '../enums';

function contextFor(
  user: unknown,
  requestOverrides: Record<string, unknown> = {},
) {
  const request = {
    user,
    params: {},
    query: {},
    body: {},
    ...requestOverrides,
  };
  return {
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({ getRequest: () => request }),
  } as any;
}

describe('authorization guards', () => {
  describe('RolesGuard', () => {
    it('allows a required role', () => {
      const reflector = {
        getAllAndOverride: jest
          .fn()
          .mockReturnValue([SchoolRoleEnum.SCHOOL_ADMIN]),
      };
      const guard = new RolesGuard(reflector as any);

      expect(
        guard.canActivate(contextFor({ role: SchoolRoleEnum.SCHOOL_ADMIN })),
      ).toBe(true);
    });

    it('denies a role not in the endpoint allow-list', () => {
      const reflector = {
        getAllAndOverride: jest
          .fn()
          .mockReturnValue([SchoolRoleEnum.SCHOOL_ADMIN]),
      };
      const guard = new RolesGuard(reflector as any);

      expect(() =>
        guard.canActivate(contextFor({ role: SchoolRoleEnum.PARENT })),
      ).toThrow(ForbiddenException);
    });
  });

  describe('SchoolContextGuard', () => {
    const guard = new SchoolContextGuard();

    it('rejects platform users from tenant routes', () => {
      expect(() =>
        guard.canActivate(
          contextFor({
            userType: 'platform',
            role: 'PLATFORM_ADMIN',
          }),
        ),
      ).toThrow(ForbiddenException);
    });

    it('rejects a client-supplied schoolId from another tenant', () => {
      expect(() =>
        guard.canActivate(
          contextFor(
            { userType: 'school', schoolId: 'school-a' },
            { body: { schoolId: 'school-b' } },
          ),
        ),
      ).toThrow(ForbiddenException);
    });

    it('allows a school user inside the authenticated tenant', () => {
      expect(
        guard.canActivate(
          contextFor({
            userType: 'school',
            schoolId: 'school-a',
          }),
        ),
      ).toBe(true);
    });
  });
});

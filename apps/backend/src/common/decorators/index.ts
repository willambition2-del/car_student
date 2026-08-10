import { createParamDecorator, ExecutionContext, SetMetadata, applyDecorators } from '@nestjs/common';
import { ROLES_KEY, PERMISSIONS_KEY, IS_PUBLIC_KEY } from '../constants';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const CurrentSchool = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.schoolId;
  },
);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Roles = (...roles: any[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

export const ApiPaginatedResponse = <TModel extends Function>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', default: true },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  totalPages: { type: 'number' },
                  timestamp: { type: 'string', format: 'date-time' },
                  requestId: { type: 'string' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export * from './require-feature.decorator';export * from './skip-password-change.decorator';

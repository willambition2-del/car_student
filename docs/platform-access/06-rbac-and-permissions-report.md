# 06 - RBAC and Permissions Report
## Execution
- All backend routes require `JwtAuthGuard`.
- Roles are verified via `RolesGuard` limiting scope.
- Cross-tenant requests are denied by `SchoolContextGuard`.
- Frontends conditionally render and restrict screens depending on user claims.

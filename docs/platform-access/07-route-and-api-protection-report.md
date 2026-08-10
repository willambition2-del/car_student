# 07 - Route and API Protection Report
## Execution
- Dashboards use `middleware.ts`.
- Backend uses NestJS Global Guards.
- Flutter uses GoRouter redirects with cache cleanup via `SecureStorageService.clearAuthData()` on logout.
- No bypassing auth. Auto-login removed from development environments where not explicitly intended.

# 10 - Security Remediation Log
## Fixed Vulnerabilities
1. **IDOR via `schoolId` spoofing**: Removed `schoolId` from DTOs.
2. **Missing Token Store**: Replaced in-memory OTPs with persisted `PasswordResetToken`.
3. **Missing First-Login Setup**: Added `mustChangePassword` logic to all auth flows.
4. **Middleware Bypasses**: Implemented strict Next.js `middleware.ts` in both dashboards.

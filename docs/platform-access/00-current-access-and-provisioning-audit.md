# 00 - Current Access and Provisioning Audit
## State at Audit Start
- Public website was completely missing.
- Dashboards lacked robust Next.js middleware protection.
- The must-change-password flow upon initial account provisioning was absent.
- SchoolUser and PlatformUser models lacked critical security tracking fields (e.g. `lockedUntil`, `failedLoginAttempts`).
- Missing backend validation for extracting `schoolId` from JWT only, causing potential IDOR vulnerabilities.

## State After Execution
- Provisioning endpoints strictly extract tenant context from JWT.
- Password resetting and forcing logic is implemented across all platforms (Backend, Flutter, Dashboards).
- Public website created to safely gather demo requests without exposing internal APIs.

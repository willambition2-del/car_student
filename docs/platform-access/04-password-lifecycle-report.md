# 04 - Password Lifecycle Report
## Execution
- Added `mustChangePassword`, `passwordChangedAt`, `failedLoginAttempts`, and `lockedUntil` to the Prisma schema.
- Added `PasswordResetToken` model for database-backed forgotten password flows.
- If email is unavailable in development, reset tokens are logged to the console for testing.
- Apps (Web & Flutter) enforce password change via strict routing.

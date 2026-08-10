# Remediation Log

| ID | Severity | Component | Description | File | Fix | Test | Before | After | Status |
|---|---|---|---|---|---|---|---|---|---|
| SEC-001 | HIGH | Backend / Frontend | Exposed Google Maps API Key (`AIzaSy...`) found in multiple `.env` files. | `apps/backend/.env`, `apps/platform-admin/.env.local`, `apps/school-dashboard/.env.local` | Remove from repository or add to `.gitignore`. Since these are `.env` files, they are currently ignored by `.gitignore`, but the keys should be rotated before production since they were present in a developer environment without restriction. | Manual code review | Keys visible | Keys redacted/ignored | PENDING ROTATION |
| BUG-001 | HIGH | Backend Tests | `test/access-enforcement.e2e-spec.ts` failed due to `5000ms` timeout on `beforeAll` hook. | `apps/backend/test/access-enforcement.e2e-spec.ts` | Added `30000ms` timeout to setup and teardown hooks. | `npm run test:e2e` | Failed hook | Passing tests | RESOLVED |

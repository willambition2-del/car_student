# 05 - School User Management Report
## Execution
- School Admins can provision Drivers, Supervisors, and Transport Managers.
- The frontend DTO omits `schoolId`.
- The backend `users.controller.ts` intercepts the request and injects `schoolId` exclusively from the JWT token via `@CurrentSchool()`.
- Temporary passwords assigned with mandatory change required upon first login.

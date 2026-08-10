# Permissions Current Audit Report (00)

## Overview
This document summarizes the current state of Role-Based Access Control (RBAC), Multi-Tenancy, IDOR/BOLA protection, and Mass Assignment vulnerabilities in the School Transport SaaS platform.

## 1. Multi-Tenancy Isolation
**Status**: Partially Secure but Fragile
- The `SchoolContextGuard` is correctly extracting `user.schoolId` from the JWT.
- It validates that if `schoolId` is sent in `params`, `query`, or `body`, it matches `user.schoolId`. This prevents basic BOLA where a user tries to explicitly pass another school's ID.
- **Vulnerability**: Many controllers use `@Body() body: any`. If a user passes unrelated IDs (like `busId`, `routeId`) that belong to another school, and the service doesn't verify the ownership of those secondary entities, cross-tenant data corruption can occur.

## 2. IDOR / BOLA Prevention
**Status**: Generally Mitigated via Services, but not Enforced via DB
- The services (e.g., `StudentsService.update()`) generally call `this.findOne(schoolId, id)` before proceeding to `update`. Since `findOne` enforces `schoolId`, this effectively prevents BOLA for primary entities.
- **Vulnerability**: The update query itself uses `where: { id }` which relies heavily on developers always remembering to call `findOne` first. Prisma doesn't natively allow `where: { id, schoolId }` without a unique compound index.

## 3. Mass Assignment
**Status**: CRITICAL VULNERABILITY
- **Issue**: Almost all controllers use `@Body() body: any` (e.g., `students.controller.ts`, `buses.controller.ts`, etc.).
- **Impact**: Despite `ValidationPipe` having `whitelist: true` and `forbidNonWhitelisted: true` enabled in `main.ts`, the absence of explicitly typed DTO classes completely bypasses this protection.
- **Exploitation**: An attacker can send `{ "role": "SCHOOL_ADMIN" }` or `{ "transportStatus": "FREE" }` in an update request. Since the service spreads `data` directly into Prisma `update`, these sensitive fields will be overwritten.

## 4. Socket.IO Security
**Status**: Needs Explicit Room Guards
- Currently, Socket.IO rooms (`school:{id}`, `trip:{id}`) must ensure that a user connecting to a room actually belongs to that school or trip. The backend needs explicit `WsGuard` implementation.

## 5. Mobile (Flutter) & Next.js Roles
**Status**: Client-Side Only (Needs Server Enforcement)
- The UI hides buttons, but APIs must be hardened (as detailed above) to prevent direct API calls from bypassing UI restrictions. Deep linking in Flutter must explicitly check the cached JWT role.

## Recommendations for Remediation
1. **Global DTO Implementation**: Convert all `@Body() body: any` to strictly typed DTOs (e.g., `CreateStudentDto`, `UpdateStudentDto`) to enable `class-validator` whitelisting.
2. **Specialized Guards**: Implement `ParentChildGuard` to ensure parents can only access their specific `studentId`.
3. **Audit Logging**: Add `@Injectable()` interceptors or service-level hooks to log sensitive actions to the `AuditLog` table.

# Multi-Tenant Isolation Audit (02)

## Overview
The School Transport SaaS uses a shared database, multi-tenant architecture where each tenant is identified by a `schoolId`. Ensuring strict logical separation of data is critical.

## 1. Context Enforcement (SchoolContextGuard)
**Current Implementation**:
- `SchoolContextGuard` is applied globally or per-controller.
- Extracts `schoolId` from the JWT token (populated during login).
- Checks `req.params.schoolId`, `req.query.schoolId`, and `req.body.schoolId`.
- **Verdict**: Strong against explicit spoofing. If an attacker passes a different `schoolId`, the guard catches it.

## 2. Mass Assignment Bypass
**Current Implementation**:
- Many controllers do not use strongly typed DTOs (using `@Body() body: any` instead).
- **Verdict**: Weak. If an attacker passes a payload containing foreign keys to other schools' entities (e.g., `{"busId": "SCHOOL_B_BUS_ID"}`), the `SchoolContextGuard` does *not* catch it (since the key is `busId`, not `schoolId`), and the Prisma update might execute if the service layer doesn't perform a strict cross-check.

## 3. Prisma Query Enforcement
**Current Implementation**:
- Service functions like `findAll(schoolId)` correctly apply `where: { schoolId }`.
- Read operations (`findOne`) correctly apply `where: { id, schoolId }`.
- Update/Delete operations usually call `findOne` first, then run `update({ where: { id } })`.
- **Verdict**: Mostly Secure for top-level entities. However, relations might be vulnerable.
- **Example Vulnerability**: A School Admin updating a student might assign them to a route belonging to another school, because `students.service.ts` blindly applies the update payload without verifying the `routeId` belongs to the same `schoolId`.

## 4. Remediation Plan
1. **Strict DTOs**: Force all inputs through strict DTOs. Ensure no unrelated foreign keys can be injected.
2. **Deep Relation Validation**: Before linking an entity (e.g., student to a route/bus), query the database to ensure the target entity's `schoolId` matches the `user.schoolId`.
3. **Database-Level Protection (RLS - Optional)**: While Prisma doesn't natively support Postgres Row Level Security seamlessly without extensions, we can simulate it by wrapping all operations in custom Prisma Extensions that automatically inject `{ schoolId }` into every `where` clause. For now, strict DTOs + Service validation will suffice.

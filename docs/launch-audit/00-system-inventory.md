# System Inventory & Technology Stack

## 1. Environment & Architecture
- **Type:** Monorepo-style structure without a root `package.json`.
- **Git Status:** NOT a Git Repository (or `.git` is missing/uninitialized).
- **Directory Structure:**
  - `apps/backend` (NestJS)
  - `apps/platform-admin` (Next.js)
  - `apps/school-dashboard` (Next.js)
  - `apps/public-website` (Next.js)
  - `apps/mobile` (Flutter)

## 2. Technologies & Versions
### Backend
- **Framework:** NestJS v11.0.1
- **Database ORM:** Prisma Client & Adapter for pg v7.9.1
- **Database Engine:** PostgreSQL (via `pg` v8.22.0)
- **Authentication:** Passport-JWT, Argon2 (v0.45.1)
- **Sockets:** `@nestjs/platform-socket.io` v11.1.28
- **Validation:** class-validator, class-transformer

### Frontend (Platform Admin, School Dashboard, Public Website)
- **Framework:** Next.js (versions TBD)

### Mobile
- **Framework:** Flutter (versions TBD)

## 3. Findings
- Missing root Git repository. 
- Backend heavily relies on NestJS 11 and Prisma 7, meaning strict typings and modernized routing.

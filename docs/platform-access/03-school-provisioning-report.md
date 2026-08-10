# 03 - School Provisioning Report
## Execution
- Created `POST /platform/schools/provision` endpoint inside the backend.
- Wraps `School` creation and `SchoolUser` (with role `SCHOOL_ADMIN`) creation inside a Prisma Transaction to prevent orphaned schools.
- Admin password is randomly generated securely and `mustChangePassword` is set to true.
- Provisioning UI integrated into Platform Admin Dashboard.

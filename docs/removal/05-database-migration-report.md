# Database Migration Report (05)

## Overview
This document documents the database schema modifications for removing live tracking tables without mutating historic operational data or modifying past migrations.

## Migration Details
- **Migration Name**: `20260803110115_remove_live_tracking_points`
- **File**: `apps/backend/prisma/migrations/20260803110115_remove_live_tracking_points/migration.sql`

## SQL Operations Executed
```sql
-- DropForeignKey
ALTER TABLE "trip_location_points" DROP CONSTRAINT "trip_location_points_tripId_fkey";

-- DropTable
DROP TABLE "trip_location_points";
```

## Preserved Database Models & Data
- `StudentLocation`: Preserved 100% (Student home coordinates used for map location picking).
- `Stop` / `RouteStop`: Preserved 100% (Pickup points and static route stops).
- `Route`: Preserved 100% (Route definitions).
- `Trip`: Preserved 100% (Trip logs, scheduled/actual start and end times).
- `TripEvent`: Preserved 100% (Timestamps for student boarding, school arrival, and dropoff).
- `TripStudent`: Preserved 100% (Student roster status).

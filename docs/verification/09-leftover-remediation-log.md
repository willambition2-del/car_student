# 09 - Leftover Remediation Log

The following specific actions were taken during this deep verification:

1. **apps/backend/src/tracking/tracking.gateway.ts**
   - **Action:** Moved to `trips/trips.gateway.ts`, renamed class to `TripsGateway`.
   - **Reason:** File was handling valid trip events but was miscategorized under "tracking".
2. **apps/backend/src/tracking/**
   - **Action:** Deleted entire directory.
   - **Reason:** `TrackingModule` is no longer needed.
3. **apps/backend/src/app.module.ts**
   - **Action:** Removed `TrackingModule` import.
4. **apps/backend/src/trips/trips.module.ts**
   - **Action:** Registered `TripsGateway`.
5. **apps/backend/prisma/seed.ts**
   - **Action:** Removed `live_tracking` feature flag and `gps_update_interval_seconds` setting.
6. **apps/mobile/lib/features/parent/parent_live_map_screen.dart**
   - **Action:** Renamed to `parent_route_map_screen.dart` and updated routes.
7. **apps/school-dashboard/src/components/ui/map-setup.tsx**
   - **Action:** Removed UI badges claiming "GPS Active".
8. **apps/school-dashboard/src/mock/mockData.ts**
   - **Action:** Removed `gpsStatus` from mock buses.
9. **apps/platform-admin/src/mock/mockData.ts**
   - **Action:** Removed `live_gps_tracking` from platform subscription plans.
10. **apps/mobile/lib/features/driver/driver_home_screen.dart**
    - **Action:** Fixed an invalid Icon reference that caused Flutter Analyze to fail.

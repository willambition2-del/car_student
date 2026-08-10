# Live Tracking Removal Comprehensive Audit (00)

## Overview
This document provides a complete audit of all Live Bus Tracking & Real-Time GPS Streaming components across the entire SaaS platform (Backend, Prisma DB, Socket.IO, Flutter Mobile, School Dashboard, Platform Admin) prior to removal.

## 1. Backend (NestJS) Audit
### Files & Modules
- `apps/backend/src/tracking/tracking.gateway.ts`: Real-time Socket.IO gateway handling `update_gps` and location rooms (`trip:{id}`, `bus:{id}`).
- `apps/backend/src/tracking/tracking.module.ts`: NestJS module registering `TrackingGateway`.
- `apps/backend/src/app.module.ts`: Imports `TrackingModule`.
- `apps/backend/src/trips/trips.service.ts`: Queries `locationPoints` (history of GPS points).

### Socket.IO Events
- **To Remove**:
  - `update_gps` (Real-time GPS coordinate stream from driver).
  - Subscriptions/rooms for live location streaming (`trip:{tripId}:tracking`, `bus:{busId}:tracking`).
- **To Retain**:
  - `trip:started`, `trip:completed`
  - `student:boarded`, `student:arrived-school`, `student:boarded-return`, `student:dropped-off`
  - `absence:created`, `notification:new`, `emergency:created`

## 2. Prisma Database Audit
### Models & Fields
- **Models to Remove/Deprecate**:
  - `TripLocationPoint` (schema table `trip_location_points` storing continuous lat/long/speed/heading points).
- **Fields on Models**:
  - `Trip`: `startLatitude`, `startLongitude`, `endLatitude`, `endLongitude` (Optional - retain or leave null).
  - `SchoolSetting` / `FeatureDefinition`: `live_tracking` feature key, `gps_update_interval_seconds` setting key.
- **Models to Retain**:
  - `StudentLocation` (Student home address location).
  - `Stop` / `RouteStop` (Static pickup/dropoff points for routes).
  - `Route` (Route definition and polyline).
  - `Trip` (Core trip record).
  - `TripEvent` / `TripStudent` (Student boarding and drop-off timestamps and status transitions).

## 3. Flutter Mobile App Audit
### Files & Screens
- `apps/mobile/lib/features/parent/parent_live_map_screen.dart`: Dedicated live bus map screen for parents.
- `apps/mobile/lib/app/router/app_router.dart`: Route `/parent/live-map`.
- `apps/mobile/lib/core/widgets/bottom_navigation.dart`: Navigation link to live map.
- `apps/mobile/lib/features/parent/parent_home_screen.dart`: Live bus location banner and "Track Bus" button.
- `apps/mobile/lib/features/driver/driver_home_screen.dart` & `driver_active_trip_screen.dart`: GPS pulse indicator, speed display, live navigation mode.
- `apps/mobile/lib/features/supervisor/supervisor_home_screen.dart`: GPS status indicator.

### Native Permissions & Packages
- **Permissions to Remove**:
  - `ACCESS_BACKGROUND_LOCATION` (Android / iOS background location tracking).
  - Foreground location service declarations for continuous tracking during trip.
- **Permissions & Packages to Retain**:
  - `google_maps_flutter` (Used for student house location picker & static route display).
  - `geolocator` / `permission_handler` (Used ONLY for one-time student house location pin selection).

## 4. School Dashboard Audit
- `apps/school-dashboard/src/app/(dashboard)/operations/page.tsx`: References to Live Bus Tracking & GPS pulse.
- `apps/school-dashboard/src/app/(dashboard)/buses/[id]/page.tsx`: `gpsStatus` indicator.
- `apps/school-dashboard/src/components/ui/map-setup.tsx`: Dynamic GPS simulation status badges.
- `apps/school-dashboard/src/mock/mockData.ts`: `gpsStatus` fields on bus mocks.

## 5. Platform Admin Audit
- `apps/platform-admin/src/app/(dashboard)/system-health/page.tsx`: "Socket.IO Live Bus Location Servers" metric.
- `apps/platform-admin/src/app/(dashboard)/system-health/errors/page.tsx`: "Socket.IO Live Tracking Gateway" error mock.
- `apps/platform-admin/src/mock/mockData.ts`: `live_gps_tracking` feature key mocks.

## 6. Retained Core Functionality
1. **Student Journey & Roster Management**:
   - `WAITING` -> `BOARDED` -> `ARRIVED_AT_SCHOOL` -> `BOARDED_RETURN` -> `DROPPED_OFF`.
2. **Push Notifications**:
   - Boarding, drop-off, absence, school arrival notifications remain 100% active.
3. **Student House Location Pinning**:
   - Parents & admins can still select and save student home coordinates on Google Maps.
4. **Static Route Planning & Pickup Points**:
   - Route stops and static route overview maps remain active.
5. **Offline Sync**:
   - Boarding, drop-off, absence, and emergency events are queued and synced offline. (GPS streaming payloads removed from offline queue).

## 7. Plan of Action
- **Phase 1**: Backend cleanup (`TrackingModule`, `TrackingGateway`, `TripLocationPoint` DB relation).
- **Phase 2**: Flutter App cleanup (Remove `/parent/live-map`, background GPS tasks, GPS speed UI).
- **Phase 3**: Web Dashboards cleanup (Remove live GPS indicators, replace with operational status).
- **Phase 4**: Database Migration (`05-database-migration-report.md`).
- **Phase 5**: Socket & Notification verification (`06-socket-notification-verification.md`).
- **Phase 6**: Build & E2E Verification.

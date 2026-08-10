# Live Tracking Removal Strategy & Execution Plan (01)

## Strategic Objective
Safely remove all live bus location streaming, continuous GPS background tracking, ETA calculations, and bus movement deviation alerts from the SaaS platform while preserving:
1. Student boarding and drop-off event lifecycle.
2. Parent notifications for student arrival, boarding, and absence.
3. One-time Google Maps location picker for student home addresses and static route stops.
4. Offline sync capabilities for operational events.

## Step-by-Step Execution Plan

### Step 1: Backend Refactoring (NestJS)
- **Tracking Gateway**: Remove `update_gps` socket handler and continuous GPS room broadcasts.
- **Trips Service**: Remove `locationPoints` relation query from `findOne`.
- **App Module**: Unregister `TrackingModule` or repurpose `TrackingGateway` as `EventsGateway` for trip/student events if necessary.

### Step 2: Mobile App Refactoring (Flutter)
- **Routing**: Remove `/parent/live-map` route from `app_router.dart`.
- **Parent UI**: Remove "Live Map" tab from `bottom_navigation.dart` and "Track Bus" card from `parent_home_screen.dart`.
- **Driver & Supervisor UI**: Remove GPS speed, status pulse, and background location services.
- **Permissions**: Ensure no background location permission (`ACCESS_BACKGROUND_LOCATION`) is requested.

### Step 3: Web Dashboards Refactoring
- **School Dashboard**: Update `operations/page.tsx`, `buses/page.tsx`, and `MapSetupPanel` to display operational trip status instead of live GPS tracking status.
- **Platform Admin**: Update `system-health/page.tsx` metrics to reflect real-time event socket health instead of live bus tracking.

### Step 4: Database Migration Safety
- Generate a clean Prisma migration (`remove_live_tracking_points`) to drop `trip_location_points` table without resetting or mutating existing production/seed data.

### Step 5: Verification & Quality Assurance
- Run backend compilation and tests (`npm run build`).
- Verify Flutter app router & widgets (`flutter analyze` / `dart format`).
- Verify Next.js web dashboards compilation (`npm run build`).

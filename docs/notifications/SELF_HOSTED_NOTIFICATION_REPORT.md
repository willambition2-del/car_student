# 🚀 Self-Hosted Notifications Report

## 1. Selected Solution: UnifiedPush with ntfy backend
We chose **UnifiedPush** as the push mechanism strategy for Android.
### Why UnifiedPush?
- **Battery Optimization:** Android 13+ aggressively limits background processes unless the user explicitly disables battery optimization. UnifiedPush delegates the background connection to a single "Distributor" app (like the open-source ntfy app) that is already optimized for this.
- **No Third-Party APIs:** We do not depend on FCM, Apple APNs, or external SaaS. The backend sends a standard HTTP POST request to the endpoint provided by the UnifiedPush distributor.
- **Privacy & Security:** The `endpoint` is treated as a secret. The backend isolates deliveries using `schoolId` and `userId` mapping inside PostgreSQL. 

## 2. Firebase Eradication
All traces of Firebase have been removed from the platform:
- `firebase-admin` uninstalled from `apps/backend`.
- `firebase.service.ts` deleted.
- No `firebase_core` or `firebase_messaging` packages exist in `apps/mobile/pubspec.yaml`.
- The `google-services.json` file is no longer required for push notifications.

## 3. Architecture & Database Changes
### PostgreSQL Schema (`schema.prisma`)
1. **Removed `DeviceRegistration`** and replaced it with **`PushDevice`**.
   - Added `endpoint` and `pushProvider` (`UNIFIED_PUSH`, `NTFY`).
2. **Added `NotificationDelivery`** to track the status of each push attempt (`PENDING`, `DELIVERED`, `FAILED`).
3. **Enhanced `Notification`** with `actionType`, `entityType`, `entityId`, and `expiresAt` for deeper in-app routing.

### Backend Delivery Flow
1. **Central Validation:** `NotificationsService.sendNotification` validates rules and saves the notification to PostgreSQL first.
2. **PostgreSQL Persistence:** The notification and its recipients are safely stored.
3. **Dispatch:** The service triggers `PushDeliveryService` which iterates over the active `PushDevice` records.
4. **HTTP POST:** `PushDeliveryService` sends an HTTP POST request to the device's endpoint with the notification payload.

## 4. Docker Infrastructure
A self-hosted `ntfy` server was added to `docker-compose.staging.yml`:
- Bound to port `3004`.
- Uses `NTFY_AUTH_DEFAULT_ACCESS=deny-all` to ensure no public anonymity.
- Provides a local infrastructure for the UnifiedPush distributors to connect to if configured to use our internal domain (`notify-staging.example.com`).

## 5. Flutter Mobile Implementation
- Added `unifiedpush` and `flutter_local_notifications` to `pubspec.yaml`.
- Created `PushService` (`lib/core/notifications/push_service.dart`) which:
  - Initializes Android Notification Channels (`general`, `trip_updates` with High Importance).
  - Listens to UnifiedPush `onMessage` to trigger Local Notifications.
  - Registers the `endpoint` dynamically by POSTing to the new backend API (`/school/notifications/register-device`).
- Updated `main.dart` to listen for `AppLifecycleState.resumed` and refresh unread notifications from the backend API.

## 6. Security Considerations
- **Endpoint Protection:** The UnifiedPush endpoint is unique per device and acts as a secret. The backend stores it against the `userId` in `PushDevice`.
- **Tenant Isolation:** Notifications are tied to `schoolId`. `NotificationsController` validates access via `SchoolContextGuard`.
- **Payload Minimization:** Sensitive data (like full addresses) is omitted from the push payload. The payload only contains identifiers (`entityId`, `actionType`), prompting the app to fetch full details via authenticated APIs upon opening.

## 7. Android Limitations
- Users **must** install a UnifiedPush distributor (e.g., ntfy app) on their Android devices for the background push to work without keeping our app in the foreground.
- Alternatively, if we switch to an embedded background worker, the user must manually disable "Battery Optimization" for our app, which is a poor user experience. UnifiedPush is the cleanest self-hosted standard.

## 8. Test Results
- **Backend:** Successfully builds and passes E2E tests (`access-enforcement.e2e-spec.ts` remains intact).
- **Flutter:** Passes `flutter analyze` and correctly initializes the unified push and local notification dependencies.
- **Verdict:** **SELF-HOSTED NOTIFICATIONS READY**. The system is completely decentralized from Firebase and owns its push delivery end-to-end.

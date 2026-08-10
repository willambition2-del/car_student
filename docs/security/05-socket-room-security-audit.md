# Socket.IO Room Security Audit (05)

## Overview
The platform utilizes Socket.IO for real-time tracking and event propagation (e.g., GPS updates, boarding events). It is crucial that users cannot subscribe to rooms they do not have authorization to view, and cannot broadcast to rooms they do not own.

## Vulnerability Analysis (Pre-Remediation)
- **Status**: The WebSocket gateway for real-time tracking was previously missing from the backend despite packages being installed. If implemented natively without guards, any authenticated user could emit a `join` event for any `tripId` or `busId` and listen to GPS events for other schools or trips, resulting in a Broken Object Level Authorization (BOLA) vulnerability over WebSockets.

## Remediation Implemented
A secure `TrackingGateway` has been implemented with strict connection and subscription rules:
1. **Connection Authentication**: The `handleConnection` method intercepts the connection request and decodes the JWT using `jwtService.verify()`. Unauthorized connections are immediately disconnected.
2. **Auto-Joining Tenancy Rooms**: Upon connection, a user is automatically joined to `school:{schoolId}` and `user:{userId}`. This prevents users from explicitly joining a `school` room via arbitrary client events.
3. **Trip Room Subscription (`join_trip_room`)**:
   - The user must explicitly request to join `trip:{tripId}`.
   - The gateway queries the database for the trip and verifies its `schoolId` matches the user's `schoolId`.
   - **Role-based Enforcement**: 
     - `SCHOOL_ADMIN` / `TRANSPORT_MANAGER`: Authorized.
     - `DRIVER`: Authorized only if assigned to `trip.driverId`.
     - `SUPERVISOR`: Authorized only if assigned to `trip.supervisorId`.
     - `PARENT`: Authorized only if the parent's child is physically in the `tripStudents` roster for that specific trip.
   - Unauthorized requests are rejected with an error payload.
4. **GPS Broadcasting (`update_gps`)**:
   - Only `DRIVER` roles are permitted to emit `update_gps` events.
   - The gateway verifies that the driver is indeed assigned to the active `tripId`.
   - The broadcast is restricted via `this.server.to('trip:{tripId}').emit(...)`, ensuring only authorized subscribers in the room receive the update.

## Test Cases for Verification
- **Parent Test**: A parent attempts to join `join_trip_room` with a `tripId` where their child is not assigned. Result: Rejected.
- **Driver Test**: A driver attempts to emit `update_gps` for a `tripId` belonging to another driver. Result: Rejected.
- **Cross-School Test**: A user attempts to join a `tripId` belonging to a different school. Result: Rejected (Not Found / Unauthorized).

**Conclusion**: The Socket.IO real-time channels are now fully authenticated and isolated per tenant and per entity assignment.

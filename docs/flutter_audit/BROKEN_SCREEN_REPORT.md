# Broken Screen Report

## Fixed Screens
1. **Parent Home Screen (`/parent/map-location-picker`)**
   - **Issue:** Tapping on "موقع المنزل" resulted in a blank/silent redirect due to an incorrect route string (`/parent/map-picker`).
   - **Status:** Fixed. Matches router path.

2. **Role Mixed Interfaces (Bottom Navigation & Drawers)**
   - **Issue:** All Home screens (Driver, Transport Manager, Supervisor) occasionally rendered Parent Bottom Navigation. If a Driver clicked the second tab, it tried to open `/parent/trip-history`, causing a router bounce.
   - **Status:** Fixed. Initialized `selectedRoleProvider` securely during Splash Screen.

## Current State
All screens are currently mounting successfully and matching their respective `GoRoute` definitions in `app_router.dart`.

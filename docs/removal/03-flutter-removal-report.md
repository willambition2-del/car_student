# Flutter Mobile App Live Tracking Removal Report (03)

## Overview
This document details the changes made to the Flutter Mobile App to remove live bus tracking, background GPS streaming, and continuous location UI badges while preserving student boarding events, notifications, and static map views.

## Changes Applied
1. **Parent Live Map Screen (`apps/mobile/lib/features/parent/parent_live_map_screen.dart`)**:
   - Converted from a live GPS bus tracker into a static route overview and student pickup stop details view.
   - Removed live speed, ETA countdown, and GPS connectivity badges.

2. **Parent Navigation (`apps/mobile/lib/core/widgets/bottom_navigation.dart`)**:
   - Replaced `/parent/live-map` navigation tab with `/parent/trip-history` ("السجل").

3. **Parent Home Screen (`apps/mobile/lib/features/parent/parent_home_screen.dart`)**:
   - Replaced "تتبع الحافلة المباشر على الخريطة" button with "متابعة تفاصيل وحالة الرحلة" redirecting to trip details.

4. **Driver & Supervisor Home Screens**:
   - Removed GPS speed indicators and GPS status pulse badges. Replaced with system ready status and bus capacity indicators.

5. **Permissions & Manifest (`AndroidManifest.xml`)**:
   - Verified that no background location permissions (`ACCESS_BACKGROUND_LOCATION`) or foreground location services exist.
   - Preserved `google_maps_flutter` for student home location picker and static route views.

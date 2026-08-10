# Dashboard Live Tracking Removal Report (04)

## Overview
This document details the changes made to the Web Dashboards (`school-dashboard` and `platform-admin`) to remove live GPS bus tracking indicators and update operational status views.

## Changes Applied
1. **School Dashboard (`apps/school-dashboard`)**:
   - `buses/[id]/page.tsx`: Updated bus metrics card from `تتبع الـ GPS` to `الفحص الفني` ("مفحوصة ومعتمدة").
   - `components/ui/map-setup.tsx`: Updated map panel to support static route display, student home location pinning, and map engine toggle.

2. **Platform Admin (`apps/platform-admin`)**:
   - `system-health/page.tsx`: Updated Socket.IO service metric from `Socket.IO Live Bus Location Servers` to `Socket.IO Real-time Events Gateway (Trip & Boarding)`.

3. **Preserved Web Features**:
   - Student house location picker & map pin viewer.
   - Pickup point and static route stop manager.
   - Operations trip roster & student status timeline.

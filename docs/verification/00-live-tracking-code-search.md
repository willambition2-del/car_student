# 00 - Live Tracking Code Search Audit
## Scope
Comprehensive regex search across the codebase for keywords associated with live tracking (`live_tracking`, `gps`, `tracking`, `ETA`, `eta`, `marker`, `socket`).

## Findings
We ran a custom Node.js regex script covering all apps (backend, school-dashboard, platform-admin, mobile).
The script found 188 references, out of which most were valid Socket.IO event registrations for trip status, static maps (Google Embed API), or database artifacts.

## Actions Taken
- Filtered out valid static map references and valid trip status sockets.
- Identified 10 specific files with leftover features, mock data, or Socket.IO rooms.
- See remediation log for exact actions taken on these 10 files.

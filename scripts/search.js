const fs = require('fs');
const path = require('path');

const searchTerms = [
  "tracking", "liveTracking", "live_tracking", "busLocation", "bus_location", 
  "BusLocation", "BusLocationHistory", "TripLocation", "LocationHistory", 
  "locationUpdated", "location-updated", "tracking:subscribe", "tracking:unsubscribe", 
  "gpsStatus", "gps_status", "gpsMovingIntervalSeconds", "gpsStoppedIntervalSeconds", 
  "gpsStaleAfterSeconds", "locationHistoryRetentionDays", "backgroundLocation", 
  "BackgroundLocation", "foregroundService", "locationStream", "positionStream", 
  "watchPosition", "currentSpeed", "currentHeading", "lastLatitude", "lastLongitude", 
  "lastLocationAt", "routeDeviation", "ETA", "estimatedArrival", "distanceMatrix", 
  "Distance Matrix", "busNear", "nearbyBus", "fiveMinutes", "tenMinutes", 
  "liveBusMap", "LiveBusesMap", "parentLiveMap", "trackingEnabled", "enableLiveTracking", 
  "enableETA", "enableRouteDeviation", "enableBackgroundTracking", "tracking.read", 
  "tracking.write", "tracking.history", "gps.manage"
];

const excludeDirs = ['.git', 'node_modules', '.next', 'dist', 'build', '.dart_tool', 'linux', 'windows', 'macos', 'web', 'docs'];
const regex = new RegExp(`(${searchTerms.join('|')})`, 'i');

let results = [];

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (excludeDirs.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchFiles(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.dart', '.prisma', '.json', '.yml', '.yaml', '.xml', '.swift', '.gradle', '.md'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (regex.test(line)) {
              results.push(`${fullPath}:${index + 1}: ${line.trim()}`);
            }
          });
        } catch (e) {
          // ignore read errors
        }
      }
    }
  }
}

console.log("Starting search...");
searchFiles('D:\\school-transport-saas');
fs.writeFileSync('D:\\school-transport-saas\\scripts\\search_results.txt', results.join('\n'));
console.log(`Found ${results.length} matches. Saved to search_results.txt`);

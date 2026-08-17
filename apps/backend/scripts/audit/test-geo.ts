
import { calculateDistanceMeters } from './apps/backend/src/common/utils/geo.util';
console.log('Same point: ' + calculateDistanceMeters(24.7136, 46.6753, 24.7136, 46.6753) + ' m');
console.log('Close points (111m): ' + calculateDistanceMeters(24.7136, 46.6753, 24.7146, 46.6753) + ' m');
console.log('Far points (Riyadh-Jeddah): ' + calculateDistanceMeters(24.7136, 46.6753, 21.4858, 39.1925) + ' m');


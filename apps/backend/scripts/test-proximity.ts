import { PrismaClient } from '@prisma/client';
import { calculateDistanceMeters } from '../src/common/utils/geo.util';

const prisma = new PrismaClient();

async function runProximityTest() {
  console.log('--- Proximity Engine Smoke Test ---');
  
  // 1. Get first active school
  const school = await prisma.school.findFirst({
    where: { status: 'ACTIVE' },
  });

  if (!school) {
    console.log('No active school found for testing.');
    return;
  }

  console.log(`Target School: ${school.nameAr} (${school.id})`);

  // 2. Fetch some student locations for this school
  const locations = await prisma.studentLocation.findMany({
    where: {
      student: { schoolId: school.id, isActive: true },
      isPrimary: true,
      isActive: true,
    },
    include: { student: true },
    take: 10,
  });

  if (locations.length === 0) {
    console.log('No student locations found for this school.');
    return;
  }

  // 3. Use the first location as the "Center/Target" point (e.g. a bus stop)
  const target = locations[0];
  const targetLat = Number(target.latitude);
  const targetLon = Number(target.longitude);

  console.log(`\nCenter Point: Student ${target.student.fullName} Location (Lat: ${targetLat}, Lon: ${targetLon})`);
  console.log('Radius: 5000 meters\n');

  console.log('--- Nearby Students ---');
  const nearby = [];
  
  for (const loc of locations) {
    const lat = Number(loc.latitude);
    const lon = Number(loc.longitude);
    const distance = calculateDistanceMeters(targetLat, targetLon, lat, lon);

    if (distance <= 5000) {
      nearby.push({
        name: loc.student.fullName,
        distance: Math.round(distance),
        lat,
        lon
      });
    }
  }

  // Sort by distance
  nearby.sort((a, b) => a.distance - b.distance);

  console.table(nearby);

  console.log('\n✅ Proximity Test Completed using internal Haversine (No Live GPS Calls).');
}

runProximityTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import { TripsService } from './apps/backend/src/trips/trips.service';

async function runSmoke() {
  const prisma = new PrismaClient();
  const tripsService = new TripsService(prisma);

  try {
    // Setup test data
    const school = await prisma.school.findFirst({ where: { status: 'ACTIVE' } });
    if (!school) throw new Error('No active school found');
    
    const trip = await prisma.trip.findFirst({ where: { schoolId: school.id } });
    if (!trip) throw new Error('No trip found');
    
    const tripStudent = await prisma.tripStudent.findFirst({ where: { tripId: trip.id } });
    if (!tripStudent) throw new Error('No student in trip');

    console.log(`Using School: ${school.id}, Trip: ${trip.id}, Student: ${tripStudent.studentId}`);
    
    const clientEventId = 'test-dup-' + Date.now();
    
    const event = {
      clientEventId,
      tripId: trip.id,
      studentId: tripStudent.studentId,
      status: 'BOARDED',
      timestamp: new Date().toISOString()
    };

    // First request
    console.log('Sending First Request...');
    const res1 = await tripsService.syncBatch(school.id, [event]);
    console.log('Res 1:', res1);

    // Second concurrent request (simulated by not awaiting first, but JS is single threaded so we await)
    console.log('Sending Second Request...');
    const res2 = await tripsService.syncBatch(school.id, [event]);
    console.log('Res 2:', res2);

    // Check DB
    const dbEvents = await prisma.tripEvent.findMany({ where: { operationId: clientEventId } });
    console.log('Events in DB:', dbEvents.length);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

runSmoke();

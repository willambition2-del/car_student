import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';
import { PlatformSchoolsService } from './src/platform/schools/schools.service';
import { StudentsService } from './src/students/students.service';
import { BusesService } from './src/buses/buses.service';
import { ProximityService } from './src/students/proximity.service';
import { RoutesService } from './src/routes/routes.service';
import { TripsService } from './src/trips/trips.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runAudit() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const prisma = app.get(PrismaService);
  const platformSchoolsService = app.get(PlatformSchoolsService);
  const studentsService = app.get(StudentsService);
  const busesService = app.get(BusesService);
  const proximityService = app.get(ProximityService);
  const routesService = app.get(RoutesService);
  const tripsService = app.get(TripsService);

  const report = {
    schoolCreation: false,
    studentCreation: false,
    busCreation: false,
    proximity: false,
    tripCreation: false,
    offlineSync: false,
    studentLimit: false,
    busLimit: false,
    schoolSuspension: false,
    errors: [] as string[]
  };

  try {
    console.log('--- STARTING E2E AUDIT ---');

    // 0. Platform Admin setup
    let platformAdmin = await prisma.platformUser.findFirst({ where: { email: 'admin@e2e.com' } });
    if (!platformAdmin) {
      platformAdmin = await prisma.platformUser.create({
        data: {
          fullName: 'System Admin',
          email: 'admin@e2e.com',
          passwordHash: 'hash',
          role: 'PLATFORM_ADMIN',
          isActive: true
        }
      });
    }

    // 1. Platform Admin - Create School
    const plan = await prisma.plan.create({ data: { nameAr: 'باقة تجريبية ' + Date.now(), nameEn: 'Demo Plan ' + Date.now(), maxStudents: 15, maxBuses: 3, priceMonthly: 0, priceAnnual: 0, maxRoutes: 10, maxUsers: 10 } });

    const createSchoolDto = {
      nameAr: 'Full E2E Demo School',
      nameEn: 'Full E2E Demo School',
      domain: 'e2e-demo-' + Date.now(),
      slug: 'e2e-demo-' + Date.now(),
      contactEmail: 'e2edemo' + Date.now() + '@example.com',
      contactPhone: '0500000000',
      adminName: 'School Admin',
      adminEmail: 'admin' + Date.now() + '@e2e.com',
      adminPassword: 'Password123!',
      planId: plan.id
    };

    const school = await platformSchoolsService.create(createSchoolDto, platformAdmin.id);
    report.schoolCreation = true;
    console.log('School Created:', school.id);

    const schoolId = school.id;

    // 2. Transport Manager
    const tm = await prisma.schoolUser.create({
      data: {
        schoolId,
        fullName: 'Transport Manager',
        email: 'tm' + Date.now() + '@e2e.com',
        passwordHash: 'hash',
        role: 'TRANSPORT_MANAGER',
        isActive: true
      }
    });

    // 3. Driver (Administrative Record)
    const driver = await prisma.driver.create({
      data: {
        schoolId,
        fullName: 'Ahmed Test Driver',
        phone: '0511111111',
        licenseNumber: 'L123456',
        status: 'ACTIVE'
      }
    });

    const supUser1 = await prisma.schoolUser.create({
      data: { schoolId, fullName: 'Supervisor A', email: 'supA' + Date.now() + '@e2e.com', passwordHash: 'hash', role: 'SUPERVISOR', isActive: true }
    });
    const supervisor1 = await prisma.supervisor.create({
      data: {
        schoolId,
        schoolUserId: supUser1.id,
        phone: '0522222221',
        status: 'ACTIVE'
      }
    });

    const supUser2 = await prisma.schoolUser.create({
      data: { schoolId, fullName: 'Supervisor B', email: 'supB' + Date.now() + '@e2e.com', passwordHash: 'hash', role: 'SUPERVISOR', isActive: true }
    });
    const supervisor2 = await prisma.supervisor.create({
      data: {
        schoolId,
        schoolUserId: supUser2.id,
        phone: '0522222222',
        status: 'ACTIVE'
      }
    });

    // 5. Buses
    await busesService.create(schoolId, { busNumber: 'BUS-01', plateNumber: 'ABC 123', capacity: 20, driverId: driver.id, supervisorId: supervisor1.id });
    await busesService.create(schoolId, { busNumber: 'BUS-02', plateNumber: 'ABC 124', capacity: 30, supervisorId: supervisor2.id });
    const bus3 = await busesService.create(schoolId, { busNumber: 'BUS-03', plateNumber: 'ABC 125', capacity: 15 });
    report.busCreation = true;

    // 6. Parents & Students
    const pUser1 = await prisma.schoolUser.create({
      data: { schoolId, fullName: 'Parent 1 User', email: 'p1' + Date.now() + '@e2e.com', passwordHash: 'hash', role: 'PARENT', isActive: true }
    });
    const parent1 = await prisma.guardian.create({ data: { schoolId, fullName: 'Parent 1', phone: '0533333331', relation: 'FATHER', isActive: true, schoolUserId: pUser1.id } });
    
    const pUser2 = await prisma.schoolUser.create({
      data: { schoolId, fullName: 'Parent 2 User', email: 'p2' + Date.now() + '@e2e.com', passwordHash: 'hash', role: 'PARENT', isActive: true }
    });
    const parent2 = await prisma.guardian.create({ data: { schoolId, fullName: 'Parent 2', phone: '0533333332', relation: 'MOTHER', isActive: true, schoolUserId: pUser2.id } });
    
    // Create 15 Students
    const students = [];
    for (let i = 1; i <= 15; i++) {
      const student = await studentsService.create(schoolId, {
        schoolNumber: 'ST' + Date.now() + i,
        fullName: 'Student ' + i,
        guardianId: i <= 5 ? parent1.id : parent2.id,
        gender: 'MALE'
      });
      students.push(student);

      // Add locations for proximity testing
      await prisma.studentLocation.create({
        data: {
          studentId: student.id,
          locationType: 'HOME',
          latitude: 24.7136 + (i * 0.001),
          longitude: 46.6753 + (i * 0.001),
          isPrimary: true,
          isActive: true
        }
      });
    }
    report.studentCreation = true;

    // 7. Test SaaS Limits
    try {
      await studentsService.create(schoolId, { schoolNumber: 'ST-OVERLIMIT', fullName: 'Student 16', gender: 'MALE' });
      report.errors.push('Student limit failed: allowed creation over limit');
    } catch(e: any) {
      if (e.message.includes('تجاوز الحد الأقصى للطلاب المسموح به')) {
        report.studentLimit = true;
      } else {
        console.error('Student limit wrong error:', e);
        report.errors.push('Student limit wrong error: ' + e.message);
      }
    }

    try {
      await busesService.create(schoolId, { busNumber: 'BUS-04', plateNumber: 'ABC 126', capacity: 10 });
      report.errors.push('Bus limit failed: allowed creation over limit');
    } catch(e: any) {
      if (e.message.includes('تجاوز الحد الأقصى للحافلات المسموح به')) {
        report.busLimit = true;
      } else {
        console.error('Bus limit wrong error:', e);
        report.errors.push('Bus limit wrong error: ' + e.message);
      }
    }

    // 8. Proximity
    const proximityResult = await proximityService.findStudentsNearPoint(schoolId, 24.7136, 46.6753, 5000, 10);
    if (proximityResult.candidates.length > 0 && proximityResult.isOverflow) {
      report.proximity = true;
    } else {
      report.errors.push('Proximity failed to return candidates or overflow warning');
    }

    // 9. Routes & Trips
    const route = await routesService.create(schoolId, { nameAr: 'Morning Route A', busId: bus3.id });
    for (let i = 0; i < 3; i++) {
      await routesService.assignStudent(schoolId, route.id, students[i].id);
    }

    const trip = await tripsService.startTrip(schoolId, { routeId: route.id, busId: bus3.id }, { id: 'admin', role: 'ADMIN' });
    report.tripCreation = true;

    // 10. Offline Sync
    const clientEventId = 'offline-event-' + Date.now();
    const offlineEvents = [{
      clientEventId,
      tripId: trip.id,
      studentId: students[0].id,
      status: 'BOARDED',
      timestamp: new Date().toISOString()
    }];

    const sync1 = await tripsService.syncBatch(schoolId, offlineEvents);
    const sync2 = await tripsService.syncBatch(schoolId, offlineEvents);

    if (sync1.accepted === 1 && sync2.duplicates === 1) {
      report.offlineSync = true;
    } else {
      report.errors.push('Offline Sync failed idempotency check');
    }

    // 11. School Suspension Enforcement
    await platformSchoolsService.suspend(schoolId, platformAdmin.id);
    
    try {
      await routesService.create(schoolId, { nameAr: 'Suspended Route' });
      report.errors.push('Suspension enforcement failed: allowed route creation');
    } catch(e: any) {
      if (e.message.includes('حساب المدرسة موقوف مؤقتاً') || e.message.includes('العملية مرفوضة')) {
        report.schoolSuspension = true;
      } else {
         report.errors.push('Suspension error message wrong: ' + e.message);
      }
    }

    // Reactivate
    await platformSchoolsService.activate(schoolId, platformAdmin.id);

    console.log('--- E2E AUDIT COMPLETE ---');
    console.log(JSON.stringify(report, null, 2));

  } catch(e: any) {
    console.error('Fatal Audit Error:', e);
  } finally {
    await app.close();
  }
}

runAudit();

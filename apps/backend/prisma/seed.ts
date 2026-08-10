// ═══════════════════════════════════════════════════════════════
// Seed Script - بيانات تطويرية أولية
// Idempotent: يمكن تشغيله أكثر من مرة بأمان
// ═══════════════════════════════════════════════════════════════

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 بدء تهيئة البيانات التطويرية...');

  // ── 1. مالك المنصة ──
  const platformOwner = await prisma.platformUser.upsert({
    where: { email: 'owner@schooltransport-saas.com' },
    update: {},
    create: {
      email: 'owner@schooltransport-saas.com',
      passwordHash: await argon2.hash('Owner@2026!Dev'),
      fullName: 'مالك المنصة',
      phone: '+966500000001',
      role: 'PLATFORM_OWNER',
      isActive: true,
    },
  });
  console.log(`  ✅ مالك المنصة: ${platformOwner.email}`);

  // ── 2. مسؤول دعم المنصة ──
  const platformSupport = await prisma.platformUser.upsert({
    where: { email: 'support@schooltransport-saas.com' },
    update: {},
    create: {
      email: 'support@schooltransport-saas.com',
      passwordHash: await argon2.hash('Support@2026!Dev'),
      fullName: 'فريق الدعم الفني',
      phone: '+966500000002',
      role: 'PLATFORM_SUPPORT',
      isActive: true,
    },
  });
  console.log(`  ✅ دعم المنصة: ${platformSupport.email}`);

  // ── 3. تعريفات الميزات ──
  const schoolFeatures = [
    { key: 'parent_app', nameAr: 'تطبيق ولي الأمر', category: 'core', defaultValue: true },
    { key: 'supervisor_app', nameAr: 'تطبيق المشرفة', category: 'apps', defaultValue: true },
    { key: 'driver_app', nameAr: 'تطبيق السائق', category: 'apps', defaultValue: true },
    { key: 'offline_sync', nameAr: 'العمل دون إنترنت', category: 'sync', defaultValue: false },
    { key: 'address_change', nameAr: 'طلبات تغيير العنوان', category: 'locations', defaultValue: true },
    { key: 'absence_requests', nameAr: 'طلبات الغياب المسبق', category: 'attendance', defaultValue: true },
    { key: 'push_notifications', nameAr: 'إشعارات الدفع', category: 'notifications', defaultValue: true },
    { key: 'sms_notifications', nameAr: 'إشعارات SMS', category: 'notifications', defaultValue: false },
    { key: 'financial_module', nameAr: 'الوحدة المالية', category: 'finance', defaultValue: true },
    { key: 'reports_advanced', nameAr: 'التقارير المتقدمة', category: 'reports', defaultValue: false },
    { key: 'csv_export', nameAr: 'تصدير CSV', category: 'reports', defaultValue: true },
    { key: 'multi_route', nameAr: 'مسارات متعددة', category: 'routes', defaultValue: true },
    { key: 'emergency_reports', nameAr: 'بلاغات الطوارئ', category: 'safety', defaultValue: true },
    { key: 'api_access', nameAr: 'الوصول للـAPI', category: 'integration', defaultValue: false },
  ];

  for (const feat of schoolFeatures) {
    await prisma.featureDefinition.upsert({
      where: { key: feat.key },
      update: {},
      create: {
        key: feat.key,
        nameAr: feat.nameAr,
        category: feat.category,
        defaultValue: feat.defaultValue,
        isGlobal: true,
      },
    });
  }
  console.log(`  ✅ تعريفات الميزات: ${schoolFeatures.length} ميزة`);

  // ── 4. الباقات ──
  const basicPlan = await prisma.plan.upsert({
    where: { id: 'plan-basic' },
    update: {},
    create: {
      id: 'plan-basic',
      nameAr: 'الباقة الأساسية',
      nameEn: 'Basic Plan',
      description: 'مناسبة للمدارس الصغيرة حتى 200 طالب و10 حافلات',
      priceMonthly: 2500,
      priceAnnual: 25000,
      maxStudents: 200,
      maxBuses: 10,
      maxRoutes: 20,
      maxUsers: 20,
      isPopular: false,
      sortOrder: 1,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { id: 'plan-pro' },
    update: {},
    create: {
      id: 'plan-pro',
      nameAr: 'الباقة الاحترافية',
      nameEn: 'Professional Plan',
      description: 'مناسبة للمدارس المتوسطة حتى 500 طالب و25 حافلة مع ميزات متقدمة',
      priceMonthly: 5000,
      priceAnnual: 50000,
      maxStudents: 500,
      maxBuses: 25,
      maxRoutes: 50,
      maxUsers: 50,
      isPopular: true,
      sortOrder: 2,
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { id: 'plan-enterprise' },
    update: {},
    create: {
      id: 'plan-enterprise',
      nameAr: 'باقة المؤسسات',
      nameEn: 'Enterprise Plan',
      description: 'مناسبة للمدارس الكبيرة والمجمعات التعليمية حتى 2000 طالب و100 حافلة',
      priceMonthly: 12000,
      priceAnnual: 120000,
      maxStudents: 2000,
      maxBuses: 100,
      maxRoutes: 200,
      maxUsers: 200,
      isPopular: false,
      sortOrder: 3,
    },
  });
  console.log('  ✅ الباقات: أساسية، احترافية، مؤسسات');

  // ربط ميزات الباقات
  const allFeatures = await prisma.featureDefinition.findMany();
  const basicFeatures = ['parent_app', 'supervisor_app', 'driver_app', 'address_change', 'absence_requests', 'push_notifications', 'financial_module', 'csv_export', 'multi_route', 'emergency_reports'];
  const proFeatures = [...basicFeatures, 'offline_sync', 'reports_advanced'];
  const enterpriseFeatures = [...proFeatures, 'sms_notifications', 'api_access'];

  for (const feat of allFeatures) {
    // Basic
    await prisma.planFeature.upsert({
      where: { planId_featureId: { planId: basicPlan.id, featureId: feat.id } },
      update: {},
      create: {
        planId: basicPlan.id,
        featureId: feat.id,
        isEnabled: basicFeatures.includes(feat.key),
      },
    });
    // Pro
    await prisma.planFeature.upsert({
      where: { planId_featureId: { planId: proPlan.id, featureId: feat.id } },
      update: {},
      create: {
        planId: proPlan.id,
        featureId: feat.id,
        isEnabled: proFeatures.includes(feat.key),
      },
    });
    // Enterprise
    await prisma.planFeature.upsert({
      where: { planId_featureId: { planId: enterprisePlan.id, featureId: feat.id } },
      update: {},
      create: {
        planId: enterprisePlan.id,
        featureId: feat.id,
        isEnabled: enterpriseFeatures.includes(feat.key),
      },
    });
  }
  console.log('  ✅ ميزات الباقات مرتبطة');

  // ── 5. مدرسة تجريبية ──
  const school = await prisma.school.upsert({
    where: { slug: 'al-mustaqbal' },
    update: {},
    create: {
      id: 'school-demo-001',
      nameAr: 'مدارس المستقبل الأهلية',
      nameEn: 'Al-Mustaqbal Private Schools',
      slug: 'al-mustaqbal',
      status: 'ACTIVE',
      phone: '+966112345678',
      email: 'info@almustaqbal.edu.sa',
      address: 'حي النرجس، الرياض',
      city: 'الرياض',
      region: 'منطقة الرياض',
      country: 'SA',
      taxNumber: '309812345600003',
      timezone: 'Asia/Riyadh',
      academicYear: '1447-1448',
      maxStudents: 500,
      maxBuses: 25,
      createdBy: platformOwner.id,
    },
  });
  console.log(`  ✅ المدرسة: ${school.nameAr}`);

  // ── 6. اشتراك المدرسة ──
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  await prisma.subscription.upsert({
    where: { id: 'sub-demo-001' },
    update: {},
    create: {
      id: 'sub-demo-001',
      schoolId: school.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      startDate: now,
      endDate: oneYearLater,
      autoRenew: true,
      amountPaid: 50000,
      billingCycle: 'ANNUAL',
    },
  });
  console.log('  ✅ اشتراك المدرسة: الباقة الاحترافية (سنوي)');

  // ── 7. مستخدمو المدرسة ──
  const schoolAdmin = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: school.id, email: 'admin@almustaqbal.edu.sa' } },
    update: {},
    create: {
      schoolId: school.id,
      email: 'admin@almustaqbal.edu.sa',
      passwordHash: await argon2.hash('Admin@2026!Dev'),
      fullName: 'أحمد الراشد',
      phone: '+966501234567',
      role: 'SCHOOL_ADMIN',
      isActive: true,
    },
  });
  console.log(`  ✅ مدير المدرسة: ${schoolAdmin.email}`);

  const transportMgr = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: school.id, email: 'transport@almustaqbal.edu.sa' } },
    update: {},
    create: {
      schoolId: school.id,
      email: 'transport@almustaqbal.edu.sa',
      passwordHash: await argon2.hash('Transport@2026!Dev'),
      fullName: 'خالد المالكي',
      phone: '+966501234568',
      role: 'TRANSPORT_MANAGER',
      isActive: true,
    },
  });
  console.log(`  ✅ مسؤول النقل: ${transportMgr.email}`);

  // سائق
  const driverUser = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: school.id, email: 'driver1@almustaqbal.edu.sa' } },
    update: {},
    create: {
      schoolId: school.id,
      email: 'driver1@almustaqbal.edu.sa',
      passwordHash: await argon2.hash('Driver@2026!Dev'),
      fullName: 'محمد السالم',
      phone: '+966501234569',
      role: 'DRIVER',
      isActive: true,
    },
  });

  const driver = await prisma.driver.upsert({
    where: { schoolUserId: driverUser.id },
    update: {},
    create: {
      schoolId: school.id,
      schoolUserId: driverUser.id,
      licenseNumber: 'DL-12345',
      phone: '+966501234569',
      status: 'ACTIVE',
    },
  });
  console.log(`  ✅ السائق: ${driverUser.fullName}`);

  // مشرفة
  const supervisorUser = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: school.id, email: 'supervisor1@almustaqbal.edu.sa' } },
    update: {},
    create: {
      schoolId: school.id,
      email: 'supervisor1@almustaqbal.edu.sa',
      passwordHash: await argon2.hash('Supervisor@2026!Dev'),
      fullName: 'نورة العتيبي',
      phone: '+966501234570',
      role: 'SUPERVISOR',
      isActive: true,
    },
  });

  const supervisor = await prisma.supervisor.upsert({
    where: { schoolUserId: supervisorUser.id },
    update: {},
    create: {
      schoolId: school.id,
      schoolUserId: supervisorUser.id,
      phone: '+966501234570',
      status: 'ACTIVE',
    },
  });
  console.log(`  ✅ المشرفة: ${supervisorUser.fullName}`);

  // ولي أمر
  const parentUser = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: school.id, email: 'parent1@example.com' } },
    update: {},
    create: {
      schoolId: school.id,
      email: 'parent1@example.com',
      passwordHash: await argon2.hash('Parent@2026!Dev'),
      fullName: 'عبدالله الشمري',
      phone: '+966551234567',
      role: 'PARENT',
      isActive: true,
    },
  });

  const guardian = await prisma.guardian.upsert({
    where: { schoolUserId: parentUser.id },
    update: {},
    create: {
      schoolId: school.id,
      schoolUserId: parentUser.id,
      fullName: 'عبدالله الشمري',
      phone: '+966551234567',
      email: 'parent1@example.com',
      relation: 'أب',
    },
  });
  console.log(`  ✅ ولي الأمر: ${parentUser.fullName}`);

  // ── 8. الطلاب ──
  const student1 = await prisma.student.upsert({
    where: { schoolId_schoolNumber: { schoolId: school.id, schoolNumber: 'ST-1001' } },
    update: {},
    create: {
      schoolId: school.id,
      schoolNumber: 'ST-1001',
      fullName: 'فيصل عبدالله الشمري',
      gender: 'MALE',
      grade: 'الصف الرابع',
      classSection: '4/أ',
      createdBy: schoolAdmin.id,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { schoolId_schoolNumber: { schoolId: school.id, schoolNumber: 'ST-1002' } },
    update: {},
    create: {
      schoolId: school.id,
      schoolNumber: 'ST-1002',
      fullName: 'سارة عبدالله الشمري',
      gender: 'FEMALE',
      grade: 'الصف الثاني',
      classSection: '2/ب',
      createdBy: schoolAdmin.id,
    },
  });
  console.log(`  ✅ الطلاب: ${student1.fullName}، ${student2.fullName}`);

  // ربط الطلاب بولي الأمر
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: student1.id, guardianId: guardian.id } },
    update: {},
    create: { studentId: student1.id, guardianId: guardian.id, relation: 'أب', isPrimary: true },
  });
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: student2.id, guardianId: guardian.id } },
    update: {},
    create: { studentId: student2.id, guardianId: guardian.id, relation: 'أب', isPrimary: true },
  });

  // مواقع الطلاب
  await prisma.studentLocation.upsert({
    where: { id: 'loc-st1-home' },
    update: {},
    create: {
      id: 'loc-st1-home',
      studentId: student1.id,
      locationType: 'HOME',
      latitude: 24.7741,
      longitude: 46.7386,
      regionName: 'حي النرجس',
      addressDescription: 'فيلا رقم 12، شارع الأمير سعود',
      nearestLandmark: 'بجوار مسجد الراجحي',
      isPrimary: true,
      isActive: true,
      selectionMethod: 'MAP_PIN',
    },
  });
  await prisma.studentLocation.upsert({
    where: { id: 'loc-st2-home' },
    update: {},
    create: {
      id: 'loc-st2-home',
      studentId: student2.id,
      locationType: 'HOME',
      latitude: 24.7741,
      longitude: 46.7386,
      regionName: 'حي النرجس',
      addressDescription: 'فيلا رقم 12، شارع الأمير سعود',
      nearestLandmark: 'بجوار مسجد الراجحي',
      isPrimary: true,
      isActive: true,
      selectionMethod: 'MAP_PIN',
    },
  });
  console.log('  ✅ مواقع الطلاب محفوظة');

  // ── 9. باص ──
  const bus = await prisma.bus.upsert({
    where: { schoolId_busNumber: { schoolId: school.id, busNumber: 'BUS-01' } },
    update: {},
    create: {
      schoolId: school.id,
      busNumber: 'BUS-01',
      plateNumber: 'أ ب ج 1234',
      model: 'تويوتا كوستر',
      year: 2024,
      color: 'أصفر',
      capacity: 30,
      status: 'ACTIVE',
      driverId: driver.id,
      supervisorId: supervisor.id,
    },
  });
  console.log(`  ✅ الباص: ${bus.busNumber} - ${bus.plateNumber}`);

  // ── 10. منطقة ونقاط ──
  const region = await prisma.region.upsert({
    where: { schoolId_nameAr: { schoolId: school.id, nameAr: 'شمال الرياض' } },
    update: {},
    create: {
      schoolId: school.id,
      nameAr: 'شمال الرياض',
      description: 'أحياء شمال الرياض: النرجس، الياسمين، الملقا',
    },
  });

  const stop1 = await prisma.stop.upsert({
    where: { id: 'stop-001' },
    update: {},
    create: {
      id: 'stop-001',
      schoolId: school.id,
      regionId: region.id,
      nameAr: 'نقطة تجمع حي النرجس',
      latitude: 24.7750,
      longitude: 46.7390,
      description: 'أمام مسجد الراجحي',
    },
  });

  const stop2 = await prisma.stop.upsert({
    where: { id: 'stop-002' },
    update: {},
    create: {
      id: 'stop-002',
      schoolId: school.id,
      regionId: region.id,
      nameAr: 'نقطة تجمع حي الياسمين',
      latitude: 24.8100,
      longitude: 46.6700,
      description: 'أمام حديقة الياسمين',
    },
  });
  console.log('  ✅ المناطق ونقاط التجمع');

  // ── 11. مسار ──
  const route = await prisma.route.upsert({
    where: { id: 'route-001' },
    update: {},
    create: {
      id: 'route-001',
      schoolId: school.id,
      nameAr: 'مسار شمال الرياض - صباحي',
      busId: bus.id,
      tripType: 'MORNING',
      estimatedDuration: 45,
      isActive: true,
    },
  });

  // محطات المسار
  await prisma.routeStop.upsert({
    where: { routeId_order: { routeId: route.id, order: 1 } },
    update: {},
    create: {
      routeId: route.id,
      stopId: stop1.id,
      order: 1,
      estimatedArrivalTime: '06:30',
      waitDuration: 5,
    },
  });
  await prisma.routeStop.upsert({
    where: { routeId_order: { routeId: route.id, order: 2 } },
    update: {},
    create: {
      routeId: route.id,
      stopId: stop2.id,
      order: 2,
      estimatedArrivalTime: '06:45',
      waitDuration: 5,
    },
  });

  // طلاب المسار
  await prisma.routeStudent.upsert({
    where: { routeId_studentId: { routeId: route.id, studentId: student1.id } },
    update: {},
    create: { routeId: route.id, studentId: student1.id, order: 1 },
  });
  await prisma.routeStudent.upsert({
    where: { routeId_studentId: { routeId: route.id, studentId: student2.id } },
    update: {},
    create: { routeId: route.id, studentId: student2.id, order: 2 },
  });
  console.log(`  ✅ المسار: ${route.nameAr}`);

  // ── 12. رحلة تجريبية ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const trip = await prisma.trip.upsert({
    where: { id: 'trip-demo-001' },
    update: {},
    create: {
      id: 'trip-demo-001',
      schoolId: school.id,
      routeId: route.id,
      busId: bus.id,
      driverId: driver.id,
      supervisorId: supervisor.id,
      tripType: 'MORNING',
      tripDate: today,
      status: 'SCHEDULED',
      scheduledStartTime: '06:30',
      totalStudents: 2,
    },
  });

  await prisma.tripStudent.upsert({
    where: { tripId_studentId: { tripId: trip.id, studentId: student1.id } },
    update: {},
    create: { tripId: trip.id, studentId: student1.id, status: 'WAITING', stopOrder: 1 },
  });
  await prisma.tripStudent.upsert({
    where: { tripId_studentId: { tripId: trip.id, studentId: student2.id } },
    update: {},
    create: { tripId: trip.id, studentId: student2.id, status: 'WAITING', stopOrder: 2 },
  });
  console.log(`  ✅ الرحلة التجريبية: ${trip.tripType} - ${trip.status}`);

  // ── 13. إعدادات المدرسة ──
  const defaultSettings = [
    { key: 'morning_start_time', value: '06:30', category: 'schedule' },
    { key: 'return_start_time', value: '13:00', category: 'schedule' },
    { key: 'max_students_per_bus', value: '30', category: 'transport' },
    { key: 'allow_parent_address_change', value: 'true', category: 'features' },
    { key: 'allow_parent_absence_request', value: 'true', category: 'features' },
    { key: 'max_absence_days', value: '30', category: 'attendance' },
    { key: 'academic_year', value: '1447-1448', category: 'general' },
    { key: 'current_term', value: 'الفصل الأول', category: 'general' },
  ];

  for (const setting of defaultSettings) {
    await prisma.schoolSetting.upsert({
      where: { schoolId_key: { schoolId: school.id, key: setting.key } },
      update: {},
      create: { schoolId: school.id, ...setting },
    });
  }
  console.log('  ✅ إعدادات المدرسة الافتراضية');

  console.log('\n🎉 تمت التهيئة بنجاح!');
  console.log('\n📋 بيانات الدخول التطويرية:');
  console.log('────────────────────────────────────────');
  console.log('مالك المنصة:    owner@schooltransport-saas.com    / Owner@2026!Dev');
  console.log('دعم المنصة:     support@schooltransport-saas.com  / Support@2026!Dev');
  console.log('مدير المدرسة:   admin@almustaqbal.edu.sa           / Admin@2026!Dev');
  console.log('مسؤول النقل:    transport@almustaqbal.edu.sa       / Transport@2026!Dev');
  console.log('السائق:         driver1@almustaqbal.edu.sa         / Driver@2026!Dev');
  console.log('المشرفة:        supervisor1@almustaqbal.edu.sa     / Supervisor@2026!Dev');
  console.log('ولي الأمر:      parent1@example.com                / Parent@2026!Dev');
  console.log('────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في التهيئة:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

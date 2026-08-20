const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const argon2 = require('argon2');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SCHOOL_LAT = 24.8210;
const SCHOOL_LNG = 46.6690;

const FIRST_NAMES_MALE = [
  'محمد', 'عبدالله', 'أحمد', 'فيصل', 'سعود', 'خالد', 'عمر', 'علي', 'يوسف', 'إبراهيم',
  'سلطان', 'فهد', 'عبدالرحمن', 'تركي', 'سلمان', 'ماجد', 'بدر', 'مشاري', 'ريان', 'نايف',
  'حمزة', 'يزيد', 'حمد', 'عادل', 'طارق', 'زياد', 'أنس', 'وليد', 'منصور', 'سامي'
];

const FIRST_NAMES_FEMALE = [
  'سارة', 'نورة', 'ريم', 'ليان', 'دانة', 'هند', 'جود', 'لمى', 'مريم', 'فاطمة',
  'شهد', 'منى', 'رهف', 'غلا', 'ريناد', 'تالا', 'أمل', 'عبير', 'خلود', 'ياسمين',
  'جنى', 'هيا', 'حلا', 'نجود', 'سدين', 'رغد', 'ملاك', 'أسيل', 'شروق', 'روان'
];

const FAMILY_NAMES = [
  'العتيبي', 'القحطاني', 'الشمري', 'الدوسري', 'الحربي', 'المطيري', 'الغامدي', 'الزهراني',
  'الشهري', 'السبيعي', 'المالكي', 'العنزي', 'الخالدي', 'التميمي', 'الرشيدي', 'القرني',
  'السهلي', 'المنصور', 'السالم', 'الراشد', 'الصالح', 'الشريف', 'البقمي',
  'العمري', 'الجهني', 'العلي', 'الحسن', 'الفهد', 'التركي'
];

const GRADES = [
  'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
  'الصف الأول المتوسط', 'الصف الثاني المتوسط', 'الصف الثالث المتوسط'
];

const CLUSTERS = [
  { name: 'حي النرجس (شمال)', baseLat: 24.8350, baseLng: 46.6780 },
  { name: 'حي الملقا (جنوب غرب)', baseLat: 24.8020, baseLng: 46.6340 },
  { name: 'حي الياسمين (غرب)', baseLat: 24.8180, baseLng: 46.6450 },
  { name: 'حي العارض (شمال غرب)', baseLat: 24.8450, baseLng: 46.6520 },
  { name: 'حي الصحافة (جنوب)', baseLat: 24.7950, baseLng: 46.6620 },
  { name: 'حي الربيع (جنوب شرق)', baseLat: 24.7980, baseLng: 46.6850 },
];

async function seedRealisticDemoSchool() {
  console.log('🚀 بدء إنشاء وتحديث المدرسة التجريبية الكاملة (30 يوم استخدام)...');

  // 1. Target Demo School
  let school = await prisma.school.findFirst({
    where: { OR: [{ id: 'school-demo-001' }, { id: 'cmsqdhdc80000c8uht6y40spm' }, { slug: 'tibyan' }, { slug: 'al-mustaqbal' }] }
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        id: 'school-demo-001',
        nameAr: 'مدرسة تبيان التجريبية',
        nameEn: 'Tibyan Experimental School',
        slug: 'tibyan',
        status: 'ACTIVE',
        phone: '+966114567890',
        email: 'info@tibyan.edu.sa',
        address: 'حي النرجس، طريق الملك سلمان، الرياض',
        city: 'الرياض',
        region: 'منطقة الرياض',
        country: 'SA',
        academicYear: '1447-1448',
        maxStudents: 500,
        maxBuses: 25,
      }
    });
  } else {
    school = await prisma.school.update({
      where: { id: school.id },
      data: {
        nameAr: 'مدرسة تبيان التجريبية',
        nameEn: 'Tibyan Experimental School',
        address: 'حي النرجس، طريق الملك سلمان، الرياض',
        city: 'الرياض',
        status: 'ACTIVE',
      }
    });
  }
  const sId = school.id;
  console.log(`✅ المدرسة المعتمدة: ${school.nameAr} (${sId})`);

  // 2. Standard Core Users (Passwords preserved)
  const defaultPw = await argon2.hash('School123!');
  const adminPw = await argon2.hash('Admin123!');
  const tmPw = await argon2.hash('Transport123!');
  const accPw = await argon2.hash('Account123!');
  const supPw = await argon2.hash('Supervisor123!');
  const parentPw = await argon2.hash('Parent123!');

  // Platform Admin
  await prisma.platformUser.upsert({
    where: { email: 'platform.demo@schooltransport.local' },
    update: {},
    create: {
      email: 'platform.demo@schooltransport.local',
      passwordHash: adminPw,
      fullName: 'مدير المنصة التجريبي',
      role: 'PLATFORM_ADMIN',
      isActive: true,
    }
  });

  // School Admin
  const schoolAdmin = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: sId, email: 'schooladmin.demo@schooltransport.local' } },
    update: { fullName: 'أ. عبدالعزيز التميمي (مدير المدرسة)', passwordHash: defaultPw },
    create: {
      schoolId: sId,
      email: 'schooladmin.demo@schooltransport.local',
      passwordHash: defaultPw,
      fullName: 'أ. عبدالعزيز التميمي (مدير المدرسة)',
      phone: '+966500112233',
      role: 'SCHOOL_ADMIN',
      isActive: true,
    }
  });

  // Transport Manager
  const tmUser = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: sId, email: 'transport.demo@schooltransport.local' } },
    update: { fullName: 'م. خالد المنصور (مدير النقل)', passwordHash: tmPw },
    create: {
      schoolId: sId,
      email: 'transport.demo@schooltransport.local',
      passwordHash: tmPw,
      fullName: 'م. خالد المنصور (مدير النقل)',
      phone: '+966500112234',
      role: 'TRANSPORT_MANAGER',
      isActive: true,
    }
  });

  // Accountant
  await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: sId, email: 'accountant.demo@schooltransport.local' } },
    update: { fullName: 'أ. فهد السالم (محاسب النقل)', passwordHash: accPw },
    create: {
      schoolId: sId,
      email: 'accountant.demo@schooltransport.local',
      passwordHash: accPw,
      fullName: 'أ. فهد السالم (محاسب النقل)',
      phone: '+966500112235',
      role: 'ACCOUNTANT',
      isActive: true,
    }
  });

  // 3. Six Supervisors (6 Female Supervisors)
  const SUPERVISORS_DATA = [
    { email: 'supervisor.demo@schooltransport.local', name: 'أمل محمد الشمري (مشرفة الحافلة)', phone: '+966502223301', pw: supPw },
    { email: 'supervisor2@tibyan.edu.sa', name: 'هند عبدالله السبيعي', phone: '+966502223302', pw: supPw },
    { email: 'supervisor3@tibyan.edu.sa', name: 'سمر علي القحطاني', phone: '+966502223303', pw: supPw },
    { email: 'supervisor4@tibyan.edu.sa', name: 'نورا خالد الحربي', phone: '+966502223304', pw: supPw },
    { email: 'supervisor5@tibyan.edu.sa', name: 'بشرى أحمد العنزي', phone: '+966502223305', pw: supPw },
    { email: 'supervisor6@tibyan.edu.sa', name: 'مريم صالح الزهراني', phone: '+966502223306', pw: supPw },
  ];

  const supervisorEntities = [];
  for (let i = 0; i < SUPERVISORS_DATA.length; i++) {
    const sData = SUPERVISORS_DATA[i];
    const sUser = await prisma.schoolUser.upsert({
      where: { schoolId_email: { schoolId: sId, email: sData.email } },
      update: { fullName: sData.name, phone: sData.phone, passwordHash: sData.pw },
      create: {
        schoolId: sId,
        email: sData.email,
        passwordHash: sData.pw,
        fullName: sData.name,
        phone: sData.phone,
        role: 'SUPERVISOR',
        isActive: true,
      }
    });

    const supRecord = await prisma.supervisor.upsert({
      where: { schoolUserId: sUser.id },
      update: { phone: sData.phone, status: 'ACTIVE' },
      create: {
        schoolId: sId,
        schoolUserId: sUser.id,
        phone: sData.phone,
        status: 'ACTIVE',
      }
    });
    supervisorEntities.push(supRecord);
  }
  console.log(`✅ 6 مشرفات حافلات تم إعدادهن.`);

  // 4. Six Drivers (Administrative Entity Only - NO LOGIN)
  const DRIVERS_DATA = [
    { name: 'سعد ناصر الدوسري', license: 'DL-410291', phone: '+966501112201' },
    { name: 'إبراهيم خليل القحطاني', license: 'DL-410292', phone: '+966501112202' },
    { name: 'منصور فهد العتيبي', license: 'DL-410293', phone: '+966501112203' },
    { name: 'ياسر صالح الغامدي', license: 'DL-410294', phone: '+966501112204' },
    { name: 'فواز حمود الحربي', license: 'DL-410295', phone: '+966501112205' },
    { name: 'خالد إبراهيم المطيري', license: 'DL-410296', phone: '+966501112206' },
  ];

  const driverEntities = [];
  for (let i = 0; i < DRIVERS_DATA.length; i++) {
    const dData = DRIVERS_DATA[i];
    let drv = await prisma.driver.findFirst({
      where: { schoolId: sId, licenseNumber: dData.license }
    });
    if (!drv) {
      drv = await prisma.driver.create({
        data: {
          schoolId: sId,
          fullName: dData.name,
          licenseNumber: dData.license,
          phone: dData.phone,
          status: 'ACTIVE',
        }
      });
    } else {
      drv = await prisma.driver.update({
        where: { id: drv.id },
        data: { fullName: dData.name, phone: dData.phone }
      });
    }
    driverEntities.push(drv);
  }
  console.log(`✅ 6 سجلات سائقين إدارية جاهزة.`);

  // 5. Six Buses
  const BUSES_DATA = [
    { number: '201', plate: 'أ ب د 2011', capacity: 25, model: 'تويوتا كوستر 2024', drvIdx: 0, supIdx: 1 },
    { number: '202', plate: 'ر س ح 2022', capacity: 25, model: 'ميتسوبيشي روزا 2023', drvIdx: 1, supIdx: 2 },
    { number: '203', plate: 'ص ع ف 2033', capacity: 25, model: 'مرسيدس بنز سبرينتر 2024', drvIdx: 2, supIdx: 3 },
    { number: '204', plate: 'ق ك ل 2044', capacity: 25, model: 'تويوتا كوستر 2023', drvIdx: 3, supIdx: 4 },
    { number: '205', plate: 'م ن هـ 2055', capacity: 25, model: 'هيونداي يونيفرس 2024', drvIdx: 4, supIdx: 0 }, // Demo Bus (Bus 205 & Sup Demo)
    { number: '206', plate: 'و ي أ 2066', capacity: 25, model: 'إيسوزو نوفو 2024', drvIdx: 5, supIdx: 5 },
  ];

  const busEntities = [];
  for (let i = 0; i < BUSES_DATA.length; i++) {
    const b = BUSES_DATA[i];
    const drv = driverEntities[b.drvIdx];
    const sup = supervisorEntities[b.supIdx];

    const bus = await prisma.bus.upsert({
      where: { schoolId_busNumber: { schoolId: sId, busNumber: b.number } },
      update: {
        plateNumber: b.plate,
        capacity: b.capacity,
        model: b.model,
        driverId: drv.id,
        supervisorId: sup.id,
        status: 'ACTIVE'
      },
      create: {
        schoolId: sId,
        busNumber: b.number,
        plateNumber: b.plate,
        capacity: b.capacity,
        model: b.model,
        driverId: drv.id,
        supervisorId: sup.id,
        status: 'ACTIVE',
      }
    });
    busEntities.push(bus);
  }
  console.log(`✅ 6 حافلات مدرسية جاهزة ومربوطة.`);

  // 6. Six Routes & Stops
  const ROUTES_DATA = [
    { id: `ROUTE-${sId}-01`, name: 'المسار الشمالي - حي النرجس والياسمين', busIdx: 0, clusterIdx: 0 },
    { id: `ROUTE-${sId}-02`, name: 'المسار الجنوبي - حي الملقا وحطين', busIdx: 1, clusterIdx: 1 },
    { id: `ROUTE-${sId}-03`, name: 'المسار الغربي - حي الياسمين والصحافة', busIdx: 2, clusterIdx: 2 },
    { id: `ROUTE-${sId}-04`, name: 'المسار الشمالي الغربي - حي العارض', busIdx: 3, clusterIdx: 3 },
    { id: `ROUTE-${sId}-05`, name: 'المسار المركزي - حي الندى والقرطبة (حافلة 205)', busIdx: 4, clusterIdx: 4 }, // Demo Bus 205
    { id: `ROUTE-${sId}-06`, name: 'مسار الأحياء الشرقية - حي الربيع والفلاح', busIdx: 5, clusterIdx: 5 },
  ];

  const routeEntities = [];
  for (let i = 0; i < ROUTES_DATA.length; i++) {
    const r = ROUTES_DATA[i];
    const bus = busEntities[r.busIdx];

    const route = await prisma.route.upsert({
      where: { id: r.id },
      update: { nameAr: r.name, busId: bus.id, isActive: true },
      create: {
        id: r.id,
        schoolId: sId,
        nameAr: r.name,
        busId: bus.id,
        isActive: true,
        estimatedDuration: 45,
      }
    });
    routeEntities.push(route);

    // Create 4 stops for each route
    const cluster = CLUSTERS[r.clusterIdx];
    for (let sIdx = 1; sIdx <= 4; sIdx++) {
      const stopCode = `${r.id}-STOP-${sIdx}`;
      const stopLat = cluster.baseLat + (sIdx * 0.003 * (sIdx % 2 === 0 ? 1 : -1));
      const stopLng = cluster.baseLng + (sIdx * 0.003 * (sIdx % 2 === 0 ? -1 : 1));

      const stop = await prisma.stop.upsert({
        where: { id: stopCode },
        update: { nameAr: `نقطة تجمع ${sIdx} - ${cluster.name}`, latitude: stopLat, longitude: stopLng },
        create: {
          id: stopCode,
          schoolId: sId,
          nameAr: `نقطة تجمع ${sIdx} - ${cluster.name}`,
          latitude: stopLat,
          longitude: stopLng,
        }
      });

      await prisma.routeStop.upsert({
        where: { routeId_stopId: { routeId: route.id, stopId: stop.id } },
        update: { order: sIdx },
        create: {
          routeId: route.id,
          stopId: stop.id,
          order: sIdx,
          estimatedArrivalTime: `06:${30 + (sIdx * 8)}`,
        }
      });
    }
  }
  console.log(`✅ 6 مسارات و 24 نقطة توقف تم إعدادها.`);

  // 7. Guardians & Students (120 Students, ~85 Guardians)
  console.log('⏳ إعداد 120 طالب و 85 ولي أمر بالعلاقات والمواقع...');

  // Special Demo Parent: parent.demo@schooltransport.local
  const demoParentUser = await prisma.schoolUser.upsert({
    where: { schoolId_email: { schoolId: sId, email: 'parent.demo@schooltransport.local' } },
    update: { fullName: 'أ. أحمد المنصور (ولي الأمر التجريبي)', phone: '+966551234500', passwordHash: parentPw },
    create: {
      schoolId: sId,
      email: 'parent.demo@schooltransport.local',
      passwordHash: parentPw,
      fullName: 'أ. أحمد المنصور (ولي الأمر التجريبي)',
      phone: '+966551234500',
      role: 'PARENT',
      isActive: true,
    }
  });

  const demoGuardian = await prisma.guardian.upsert({
    where: { schoolUserId: demoParentUser.id },
    update: { fullName: 'أحمد المنصور', phone: '+966551234500', email: 'parent.demo@schooltransport.local' },
    create: {
      schoolId: sId,
      schoolUserId: demoParentUser.id,
      fullName: 'أحمد المنصور',
      phone: '+966551234500',
      email: 'parent.demo@schooltransport.local',
      relation: 'أب',
    }
  });

  // Child A: Full location + Route 5 (Bus 205) + Full history
  const childA = await prisma.student.upsert({
    where: { schoolId_schoolNumber: { schoolId: sId, schoolNumber: 'ST-DEMO-01' } },
    update: { fullName: 'فيصل أحمد المنصور', grade: 'الصف الثالث الابتدائي', isActive: true },
    create: {
      schoolId: sId,
      schoolNumber: 'ST-DEMO-01',
      fullName: 'فيصل أحمد المنصور',
      grade: 'الصف الثالث الابتدائي',
      gender: 'MALE',
      isActive: true,
    }
  });
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: childA.id, guardianId: demoGuardian.id } },
    update: { isPrimary: true },
    create: { studentId: childA.id, guardianId: demoGuardian.id, isPrimary: true, relation: 'أب' }
  });
  await prisma.studentLocation.deleteMany({ where: { studentId: childA.id } });
  await prisma.studentLocation.create({
    data: {
      studentId: childA.id,
      locationType: 'HOME',
      latitude: 24.8195,
      longitude: 46.6625,
      addressDescription: 'حي النرجس - شارع رقم 14 - فيلا 22',
      neighborhood: 'حي النرجس',
      isPrimary: true,
      isActive: true,
    }
  });
  await prisma.routeStudent.upsert({
    where: { routeId_studentId: { routeId: routeEntities[4].id, studentId: childA.id } },
    update: { order: 1, isActive: true },
    create: { routeId: routeEntities[4].id, studentId: childA.id, order: 1, isActive: true }
  });

  // Child B: No location (To test missing location state)
  const childB = await prisma.student.upsert({
    where: { schoolId_schoolNumber: { schoolId: sId, schoolNumber: 'ST-DEMO-02' } },
    update: { fullName: 'ريما أحمد المنصور', grade: 'الصف الأول الابتدائي', isActive: true },
    create: {
      schoolId: sId,
      schoolNumber: 'ST-DEMO-02',
      fullName: 'ريما أحمد المنصور',
      grade: 'الصف الأول الابتدائي',
      gender: 'FEMALE',
      isActive: true,
    }
  });
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: childB.id, guardianId: demoGuardian.id } },
    update: { isPrimary: true },
    create: { studentId: childB.id, guardianId: demoGuardian.id, isPrimary: true, relation: 'أب' }
  });
  await prisma.studentLocation.deleteMany({ where: { studentId: childB.id } }); // NO LOCATION

  // Child C: Pending Address Change Request
  const childC = await prisma.student.upsert({
    where: { schoolId_schoolNumber: { schoolId: sId, schoolNumber: 'ST-DEMO-03' } },
    update: { fullName: 'سعود أحمد المنصور', grade: 'الصف السادس الابتدائي', isActive: true },
    create: {
      schoolId: sId,
      schoolNumber: 'ST-DEMO-03',
      fullName: 'سعود أحمد المنصور',
      grade: 'الصف السادس الابتدائي',
      gender: 'MALE',
      isActive: true,
    }
  });
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: childC.id, guardianId: demoGuardian.id } },
    update: { isPrimary: true },
    create: { studentId: childC.id, guardianId: demoGuardian.id, isPrimary: true, relation: 'أب' }
  });
  await prisma.studentLocation.deleteMany({ where: { studentId: childC.id } });
  await prisma.studentLocation.create({
    data: {
      studentId: childC.id,
      locationType: 'HOME',
      latitude: 24.8050,
      longitude: 46.6510,
      addressDescription: 'حي الياسمين - شارع الإمام سعود',
      neighborhood: 'حي الياسمين',
      isPrimary: true,
      isActive: true,
    }
  });
  await prisma.routeStudent.upsert({
    where: { routeId_studentId: { routeId: routeEntities[4].id, studentId: childC.id } },
    update: { order: 2, isActive: true },
    create: { routeId: routeEntities[4].id, studentId: childC.id, order: 2, isActive: true }
  });

  // Pending Address Request for Child C
  const existingReqC = await prisma.addressChangeRequest.findFirst({
    where: { studentId: childC.id, status: 'NEW' }
  });
  if (!existingReqC) {
    await prisma.addressChangeRequest.create({
      data: {
        schoolId: sId,
        studentId: childC.id,
        requestedBy: demoParentUser.id,
        newAddress: 'حي العارض - شارع الأمير فيصل بن بندر',
        newLatitude: 24.8410,
        newLongitude: 46.6570,
        reason: 'انتقال سكن العائلة إلى الفيلا الجديدة في حي العارض بداية الشهر القادم',
        status: 'NEW',
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      }
    });
  }

  // Generate 117 additional students (Total = 120)
  const allStudents = [childA, childB, childC];
  let guardianCounter = 1;

  for (let i = 4; i <= 120; i++) {
    const isMale = i % 2 === 0;
    const fName = isMale
      ? FIRST_NAMES_MALE[(i - 4) % FIRST_NAMES_MALE.length]
      : FIRST_NAMES_FEMALE[(i - 4) % FIRST_NAMES_FEMALE.length];
    const fatherName = FIRST_NAMES_MALE[(i + 3) % FIRST_NAMES_MALE.length];
    const family = FAMILY_NAMES[i % FAMILY_NAMES.length];
    const studentFullName = `${fName} ${fatherName} ${family}`;
    const grade = GRADES[i % GRADES.length];
    const schoolNumber = `ST-${1000 + i}`;

    const student = await prisma.student.upsert({
      where: { schoolId_schoolNumber: { schoolId: sId, schoolNumber } },
      update: { fullName: studentFullName, grade, isActive: true },
      create: {
        schoolId: sId,
        schoolNumber,
        fullName: studentFullName,
        grade,
        gender: isMale ? 'MALE' : 'FEMALE',
        isActive: true,
      }
    });
    allStudents.push(student);

    // Link guardian (every guardian has 1-2 students)
    if (i % 2 === 0 || i === 4) {
      guardianCounter++;
      const gEmail = `guardian${guardianCounter}@tibyan.edu.sa`;
      const gFullName = `${fatherName} ${family}`;
      const gUser = await prisma.schoolUser.upsert({
        where: { schoolId_email: { schoolId: sId, email: gEmail } },
        update: { fullName: gFullName },
        create: {
          schoolId: sId,
          email: gEmail,
          passwordHash: parentPw,
          fullName: gFullName,
          phone: `+96655${(1000000 + i).toString().slice(0, 7)}`,
          role: 'PARENT',
          isActive: true,
        }
      });
      const guardian = await prisma.guardian.upsert({
        where: { schoolUserId: gUser.id },
        update: { fullName: gFullName },
        create: {
          schoolId: sId,
          schoolUserId: gUser.id,
          fullName: gFullName,
          phone: gUser.phone || `+96655${(1000000 + i).toString().slice(0, 7)}`,
          email: gEmail,
          relation: 'أب',
        }
      });
      await prisma.studentGuardian.upsert({
        where: { studentId_guardianId: { studentId: student.id, guardianId: guardian.id } },
        update: { isPrimary: true },
        create: { studentId: student.id, guardianId: guardian.id, isPrimary: true, relation: 'أب' }
      });
    }

    // Distribute Locations:
    // ~70% (i <= 84): Home location
    // ~20% (85 <= i <= 108): No location
    // ~10% (109 <= i <= 120): Has location + pending/active address request
    const cluster = CLUSTERS[i % CLUSTERS.length];
    if (i <= 84 || i >= 109) {
      const latOffset = ((i * 17) % 30 - 15) * 0.001;
      const lngOffset = ((i * 23) % 30 - 15) * 0.001;
      const homeLat = cluster.baseLat + latOffset;
      const homeLng = cluster.baseLng + lngOffset;

      await prisma.studentLocation.deleteMany({ where: { studentId: student.id } });
      await prisma.studentLocation.create({
        data: {
          studentId: student.id,
          locationType: 'HOME',
          latitude: homeLat,
          longitude: homeLng,
          addressDescription: `${cluster.name} - مبنى ${i + 10} - شارع ${((i * 3) % 20) + 1}`,
          neighborhood: cluster.name,
          isPrimary: true,
          isActive: true,
        }
      });

      // Assign to route if has location (~95 assigned total)
      const routeIdx = i % 6;
      await prisma.routeStudent.upsert({
        where: { routeId_studentId: { routeId: routeEntities[routeIdx].id, studentId: student.id } },
        update: { order: (i % 20) + 1, isActive: true },
        create: { routeId: routeEntities[routeIdx].id, studentId: student.id, order: (i % 20) + 1, isActive: true }
      });
    } else {
      // 20% have NO location
      await prisma.studentLocation.deleteMany({ where: { studentId: student.id } });
    }
  }
  console.log(`✅ 120 طالب و ${guardianCounter + 1} ولي أمر تم إعدادهم.`);

  // 8. 30 Days of Trip History
  console.log('⏳ إنشاء رحلات وأحداث آخر 30 يوم دراسي...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tripsCreated = 0;
  let eventsCreated = 0;

  for (let d = 29; d >= 0; d--) {
    const tripDate = new Date(today);
    tripDate.setDate(tripDate.getDate() - d);
    const dayOfWeek = tripDate.getDay(); // 5 = Fri, 6 = Sat

    if (dayOfWeek === 5 || dayOfWeek === 6) continue; // Weekend

    const isToday = (d === 0);

    for (let rIdx = 0; rIdx < routeEntities.length; rIdx++) {
      const route = routeEntities[rIdx];
      const bus = busEntities[rIdx];
      const sup = supervisorEntities[rIdx];
      const drv = driverEntities[rIdx];

      const rStudents = await prisma.routeStudent.findMany({
        where: { routeId: route.id, isActive: true },
        include: { student: true }
      });

      if (rStudents.length === 0) continue;

      // ── Morning Trip ──
      const mDate = new Date(tripDate);
      mDate.setHours(6, 45, 0, 0);

      const mStatus = isToday ? 'STARTED' : 'COMPLETED';
      const mTripId = `TRIP-M-${rIdx + 1}-${tripDate.toISOString().slice(0, 10)}`;

      const mTrip = await prisma.trip.upsert({
        where: { id: mTripId },
        update: { status: mStatus, tripDate },
        create: {
          id: mTripId,
          schoolId: sId,
          routeId: route.id,
          busId: bus.id,
          supervisorId: sup.id,
          driverId: drv.id,
          tripType: 'MORNING',
          tripDate,
          scheduledStartTime: '06:45',
          actualStartTime: mDate,
          status: mStatus,
          totalStudents: rStudents.length,
          boardedCount: Math.max(1, rStudents.length - 1),
        }
      });
      tripsCreated++;

      for (let sI = 0; sI < rStudents.length; sI++) {
        const rs = rStudents[sI];
        const isAbsentToday = ((d * 7 + sI) % 17 === 0);
        const stStatus = isAbsentToday ? 'ABSENT' : (isToday ? 'BOARDED' : 'ARRIVED_AT_SCHOOL');

        await prisma.tripStudent.upsert({
          where: { tripId_studentId: { tripId: mTrip.id, studentId: rs.studentId } },
          update: { status: stStatus },
          create: {
            tripId: mTrip.id,
            studentId: rs.studentId,
            status: stStatus,
            stopOrder: rs.order || (sI + 1),
            boardedAt: !isAbsentToday ? new Date(mDate.getTime() + (sI + 1) * 3 * 60000) : null,
          }
        });

        if (!isAbsentToday && d <= 7) {
          const eventTime = new Date(mDate.getTime() + (sI + 1) * 3 * 60000);
          const opId = `OP-EV-M-${mTrip.id}-${rs.studentId}`;
          await prisma.tripEvent.upsert({
            where: { operationId: opId },
            update: { newStatus: stStatus },
            create: {
              tripId: mTrip.id,
              studentId: rs.studentId,
              eventType: 'STUDENT_BOARDED',
              operationId: opId,
              newStatus: stStatus,
              recordedBy: sup.id,
              deviceTimestamp: eventTime,
            }
          });
          eventsCreated++;
        }
      }

      // ── Return Trip ──
      const rDate = new Date(tripDate);
      rDate.setHours(13, 0, 0, 0);

      const rStatus = isToday ? 'SCHEDULED' : 'COMPLETED';
      const rTripId = `TRIP-R-${rIdx + 1}-${tripDate.toISOString().slice(0, 10)}`;

      const rTrip = await prisma.trip.upsert({
        where: { id: rTripId },
        update: { status: rStatus, tripDate },
        create: {
          id: rTripId,
          schoolId: sId,
          routeId: route.id,
          busId: bus.id,
          supervisorId: sup.id,
          driverId: drv.id,
          tripType: 'RETURN',
          tripDate,
          scheduledStartTime: '13:00',
          actualStartTime: !isToday ? rDate : null,
          status: rStatus,
          totalStudents: rStudents.length,
        }
      });
      tripsCreated++;

      for (let sI = 0; sI < rStudents.length; sI++) {
        const rs = rStudents[sI];
        const isAbsentToday = ((d * 7 + sI) % 17 === 0);
        const stStatus = isAbsentToday ? 'ABSENT' : (isToday ? 'WAITING' : 'DROPPED_OFF');

        await prisma.tripStudent.upsert({
          where: { tripId_studentId: { tripId: rTrip.id, studentId: rs.studentId } },
          update: { status: stStatus },
          create: {
            tripId: rTrip.id,
            studentId: rs.studentId,
            status: stStatus,
            stopOrder: rs.order || (sI + 1),
            droppedOffAt: (!isAbsentToday && !isToday) ? new Date(rDate.getTime() + (sI + 1) * 3 * 60000) : null,
          }
        });
      }
    }
  }
  console.log(`✅ تم إنشاء ${tripsCreated} رحلة و ${eventsCreated} حدث خلال آخر 30 يوم.`);

  // 9. Absence Requests (12 Requests)
  console.log('⏳ إنشاء طلبات الغياب المسبق...');
  const absenceReasons = [
    'موعد طبي في مستشفى الملك فيصل التخصصي',
    'وعكة صحية طارئة وراحة في المنزل',
    'سفر عائلي قصير لحضور مناسبة',
    'استلام ولي الأمر للطالب مباشرة بعد الدوام',
    'ارتباط عائلي مسبق',
    'إجراء فحوصات طبية دورية',
  ];

  for (let a = 1; a <= 12; a++) {
    const st = allStudents[(a * 7) % allStudents.length];
    const status = a <= 6 ? 'APPROVED' : (a <= 10 ? 'PENDING' : 'REJECTED');
    const reqDate = new Date(today);
    reqDate.setDate(reqDate.getDate() - (a % 15));

    await prisma.absenceRequest.upsert({
      where: { id: `ABS-REQ-DEMO-${a}` },
      update: { status, reason: absenceReasons[a % absenceReasons.length] },
      create: {
        id: `ABS-REQ-DEMO-${a}`,
        schoolId: sId,
        studentId: st.id,
        requestedBy: demoParentUser.id,
        startDate: reqDate,
        endDate: reqDate,
        absenceType: 'FULL_DAY',
        reason: absenceReasons[a % absenceReasons.length],
        status,
        createdAt: new Date(reqDate.getTime() - 24 * 3600 * 1000),
      }
    });
  }
  console.log(`✅ 12 طلب غياب مسبق جاهزة.`);

  // 10. Address Change Requests (11 Requests: 5 Pending, 4 Approved, 2 Rejected)
  console.log('⏳ إنشاء طلبات تغيير العناوين...');
  for (let ad = 1; ad <= 11; ad++) {
    const st = allStudents[(ad * 9) % allStudents.length];
    const status = ad <= 5 ? 'NEW' : (ad <= 9 ? 'APPROVED' : 'REJECTED');
    const cluster = CLUSTERS[(ad + 2) % CLUSTERS.length];

    await prisma.addressChangeRequest.upsert({
      where: { id: `ADDR-REQ-DEMO-${ad}` },
      update: { status },
      create: {
        id: `ADDR-REQ-DEMO-${ad}`,
        schoolId: sId,
        studentId: st.id,
        requestedBy: demoParentUser.id,
        newAddress: `${cluster.name} - مجمع سكني رقم ${ad * 4}`,
        newLatitude: cluster.baseLat + (ad * 0.002),
        newLongitude: cluster.baseLng - (ad * 0.002),
        reason: `طلب تحديث العنوان للانتقال إلى السكن الجديد في ${cluster.name}`,
        status,
        createdAt: new Date(Date.now() - ad * 2 * 24 * 3600 * 1000),
      }
    });
  }
  console.log(`✅ 11 طلب تغيير عنوان جاهزة.`);

  // 11. Notifications History (40 Notifications)
  console.log('⏳ إنشاء سجل الإشعارات لولي الأمر...');
  const notifTypes = [
    { title: 'صعود الطالب إلى الحافلة', body: 'صعد الطالب فيصل إلى حافلة رقم 205 في رحلة الصباح', type: 'STUDENT_BOARDED' },
    { title: 'وصول الحافلة إلى المدرسة', body: 'وصلت حافلة رقم 205 بسلام إلى مدرسة تبيان', type: 'STUDENT_ARRIVED_SCHOOL' },
    { title: 'نزول الطالب في المنزل', body: 'نزل الطالب فيصل بأمان في نقطة النزول المعتمدة', type: 'STUDENT_DROPPED_OFF' },
    { title: 'قبول طلب الغياب', body: 'تمت الموافقة على طلب الغياب المقدم ليوم أمس', type: 'ABSENCE_APPROVED' },
    { title: 'تحديث حالة العنوان', body: 'تم اعتماد طلب تغيير العنوان لطالبك بنجاح', type: 'ADDRESS_REQUEST_APPROVED' },
  ];

  for (let n = 1; n <= 40; n++) {
    const notifItem = notifTypes[n % notifTypes.length];
    const nDate = new Date(Date.now() - n * 18 * 3600 * 1000);

    const notif = await prisma.notification.upsert({
      where: { id: `NOTIF-DEMO-${n}` },
      update: {},
      create: {
        id: `NOTIF-DEMO-${n}`,
        schoolId: sId,
        title: notifItem.title,
        body: notifItem.body,
        type: notifItem.type,
        createdAt: nDate,
      }
    });

    await prisma.notificationRecipient.upsert({
      where: { notificationId_userId: { notificationId: notif.id, userId: demoParentUser.id } },
      update: {},
      create: {
        notificationId: notif.id,
        userId: demoParentUser.id,
        isRead: n > 5, // First 5 unread
        readAt: n > 5 ? new Date(nDate.getTime() + 3600000) : null,
      }
    });
  }
  console.log(`✅ 40 إشعار تم ربطها بولي الأمر التجريبي.`);

  // 12. Financial Fees & Receipts (TransportFee, Payment, Receipt)
  console.log('⏳ إنشاء الرسوم والمدفوعات والإيصالات المالية...');
  for (let f = 0; f < 30; f++) {
    const st = allStudents[f];
    const feeAmount = 2500;
    const feeStatus = f % 3 === 0 ? 'PAID' : (f % 3 === 1 ? 'PARTIALLY_PAID' : 'PENDING');
    const paidAmount = feeStatus === 'PAID' ? 2500 : (feeStatus === 'PARTIALLY_PAID' ? 1250 : 0);
    const remainingAmount = feeAmount - paidAmount;

    const fee = await prisma.transportFee.upsert({
      where: { id: `FEE-DEMO-${st.id}` },
      update: { status: feeStatus, paidAmount, remainingAmount },
      create: {
        id: `FEE-DEMO-${st.id}`,
        schoolId: sId,
        studentId: st.id,
        feeType: 'ANNUAL_SUBSCRIPTION',
        description: 'رسوم النقل المدرسي السنوية 1447-1448',
        academicYear: '1447-1448',
        term: 'الفصل الدراسي الأول',
        amount: feeAmount,
        paidAmount,
        remainingAmount,
        status: feeStatus,
        dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      }
    });

    if (paidAmount > 0) {
      const payId = `PAY-DEMO-${fee.id}`;
      const payment = await prisma.payment.upsert({
        where: { id: payId },
        update: { amount: paidAmount },
        create: {
          id: payId,
          schoolId: sId,
          transportFeeId: fee.id,
          idempotencyKey: `IDEM-PAY-${payId}`,
          amount: paidAmount,
          paymentMethod: 'SADAD',
          recordedBy: tmUser.id,
          receiptNumber: `REC-1447-${1000 + f}`,
          paidAt: new Date(Date.now() - f * 24 * 3600 * 1000),
        }
      });

      await prisma.receipt.upsert({
        where: { schoolId_receiptNumber: { schoolId: sId, receiptNumber: `REC-1447-${1000 + f}` } },
        update: { amount: paidAmount },
        create: {
          id: `REC-DEMO-${payment.id}`,
          schoolId: sId,
          paymentId: payment.id,
          receiptNumber: `REC-1447-${1000 + f}`,
          studentName: st.fullName,
          guardianName: 'أحمد المنصور',
          amount: paidAmount,
          paymentMethod: 'SADAD',
          issuedBy: tmUser.id,
          issuedByName: tmUser.fullName,
          issuedAt: payment.paidAt,
        }
      });
    }
  }
  console.log(`✅ الرسوم والإيصالات المالية تم تجهيزها.`);

  console.log('\n========================================');
  console.log('🎉 انتهت تهيئة المدرسة التجريبية الكاملة بنجاح!');
  console.log('========================================');
}

seedRealisticDemoSchool()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

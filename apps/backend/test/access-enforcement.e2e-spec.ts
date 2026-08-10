import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

describe('Access Enforcement & Tenant Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let schoolAId: string;
  let schoolBId: string;
  
  let schoolAAdminToken: string;
  let schoolATempToken: string;
  let schoolBAdminToken: string;
  
  let tempUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    
    // Clean up using TRUNCATE CASCADE
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "school_users" CASCADE;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "platform_users" CASCADE;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "schools" CASCADE;`);
    
    // Seed Platform Admin
    const passHash = await argon2.hash('admin123');
    await prisma.platformUser.create({
      data: {
        fullName: 'Platform Boss',
        email: 'boss@platform.com',
        passwordHash: passHash,
        role: 'PLATFORM_OWNER',
        mustChangePassword: false
      }
    });

    // Seed a Plan
    const plan = await prisma.plan.create({
      data: {
        nameEn: 'Basic Plan',
        nameAr: 'الخطة الأساسية',
        maxStudents: 500,
        maxBuses: 10,
        priceMonthly: 100,
        priceAnnual: 1000
      }
    });

    // Seed School A
    const schoolA = await prisma.school.create({
      data: {
        nameEn: 'School A',
        nameAr: 'مدرسة أ',
        slug: 'school-a',
        status: 'ACTIVE',
        email: 'a@school.com',
        phone: '123',
        subscriptions: {
          create: {
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            planId: plan.id
          }
        }
      }
    });
    schoolAId = schoolA.id;
    
    // Seed School B
    const schoolB = await prisma.school.create({
      data: {
        nameEn: 'School B',
        nameAr: 'مدرسة ب',
        slug: 'school-b',
        status: 'ACTIVE',
        email: 'b@school.com',
        phone: '456',
        subscriptions: {
          create: {
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            planId: plan.id
          }
        }
      }
    });
    schoolBId = schoolB.id;

    // School A Admin (Password changed)
    await prisma.schoolUser.create({
      data: {
        schoolId: schoolA.id,
        fullName: 'Admin A',
        email: 'admin@schoola.com',
        passwordHash: passHash,
        role: 'SCHOOL_ADMIN',
        mustChangePassword: false
      }
    });

    // School B Admin (Password changed)
    await prisma.schoolUser.create({
      data: {
        schoolId: schoolB.id,
        fullName: 'Admin B',
        email: 'admin@schoolb.com',
        passwordHash: passHash,
        role: 'SCHOOL_ADMIN',
        mustChangePassword: false
      }
    });

    // School A Temporary User (must change password)
    const tempUser = await prisma.schoolUser.create({
      data: {
        schoolId: schoolA.id,
        fullName: 'Temp Admin',
        email: 'tempadmin@schoola.com',
        passwordHash: passHash,
        role: 'SCHOOL_ADMIN',
        mustChangePassword: true
      }
    });
    tempUserId = tempUser.id;

    // Login to get tokens
    const resA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@schoola.com', password: 'admin123' });
    console.log('Login Response:', resA.body);
    schoolAAdminToken = resA.body.data?.accessToken ?? resA.body.accessToken;

    const resB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@schoolb.com', password: 'admin123' });
    console.log('Login B Response:', resB.body);
    schoolBAdminToken = resB.body.data?.accessToken ?? resB.body.accessToken;

    const resTemp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'tempadmin@schoola.com', password: 'admin123' });
    console.log('Login Temp Response:', resTemp.body);
    schoolATempToken = resTemp.body.data?.accessToken ?? resTemp.body.accessToken;
  }, 30000);

  afterAll(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "school_users" CASCADE;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "schools" CASCADE;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "platform_users" CASCADE;`);
    await app.close();
  }, 30000);

  it('1. mustChangePassword=true blocks access to protected routes', async () => {
    const res = await request(app.getHttpServer())
      .get('/school/users') // A protected route for school users
      .set('Authorization', `Bearer ${schoolATempToken}`);
    
    expect(res.status).toBe(403);
    expect(res.body.message).toContain('يجب تغيير كلمة المرور');
  });

  it('2. mustChangePassword=true ALLOWS access to /auth/change-password', async () => {
    // Attempting to change password shouldn't be blocked by the guard
    const res = await request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${schoolATempToken}`)
      .send({ currentPassword: 'admin123', newPassword: 'NewSecurePassword123' });
    
    // We expect 200 OK since the guard is skipped
    expect(res.status).toBe(200);
    
    // The DB flag should now be false
    const updatedUser = await prisma.schoolUser.findUnique({ where: { id: tempUserId } });
    expect(updatedUser.mustChangePassword).toBe(false);
  });

  it('3. School A Admin can list users for School A', async () => {
    const res = await request(app.getHttpServer())
      .get('/school/users')
      .set('Authorization', `Bearer ${schoolAAdminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('4. School A Admin CANNOT fetch a specific user from School B', async () => {
    // Find a user ID belonging to school B
    const userB = await prisma.schoolUser.findFirst({ where: { schoolId: schoolBId } });
    
    const res = await request(app.getHttpServer())
      .get(`/school/users/${userB.id}`)
      .set('Authorization', `Bearer ${schoolAAdminToken}`);
    
    // Should be not found because SchoolContextGuard enforces the WHERE clause
    expect(res.status).toBe(404);
  });

  it('5. School A Admin CANNOT create a user inside School B via spoofed DTO', async () => {
    const res = await request(app.getHttpServer())
      .post('/school/users')
      .set('Authorization', `Bearer ${schoolAAdminToken}`)
      .send({
        schoolId: schoolBId, // Spoofing attempt
        name: 'Hacked User',
        email: 'hacked@schoolb.com',
        role: 'SUPERVISOR'
      });
    
    // The created user MUST belong to School A, overriding the DTO
    if (res.status === 201) {
       expect(res.body.data.schoolId).toBe(schoolAId);
    } else {
       // Or it might be forbidden
       expect(res.status).toBe(403);
    }
  });

  it('6. Forged JWT is rejected (401 Unauthorized)', async () => {
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    const res = await request(app.getHttpServer())
      .get('/school/users')
      .set('Authorization', `Bearer ${forgedToken}`);
    
    expect(res.status).toBe(401);
  });
});

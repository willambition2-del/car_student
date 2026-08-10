import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SchoolRoleEnum } from '../common/enums';

const mockPrismaService = {
  schoolUser: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  }
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Tenant Isolation', () => {
    const schoolId = 'school-1';
    const otherSchoolId = 'school-2';
    const userId = 'user-1';

    it('should query schoolUser by schoolId in findOne', async () => {
      mockPrismaService.schoolUser.findFirst.mockResolvedValue({
        id: userId,
        schoolId: schoolId,
        email: 'test@school.com',
      });

      await service.findOne(schoolId, userId);

      // Verify that findFirst was called with the correct schoolId
      expect(prisma.schoolUser.findFirst).toHaveBeenCalledWith({
        where: { id: userId, schoolId, deletedAt: null },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user belongs to another school', async () => {
      // Simulate finding nothing because the schoolId doesn't match
      mockPrismaService.schoolUser.findFirst.mockResolvedValue(null);

      await expect(service.findOne(otherSchoolId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Create User', () => {
    it('should create a user for a specific school', async () => {
      mockPrismaService.schoolUser.findFirst.mockResolvedValue(null); // No existing user
      mockPrismaService.schoolUser.create.mockResolvedValue({ id: 'new-user', email: 'test@test.com' });

      await service.create('school-1', {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
        role: SchoolRoleEnum.SCHOOL_ADMIN,
      }, 'creator-1');

      expect(prisma.schoolUser.findFirst).toHaveBeenCalledWith({
        where: { schoolId: 'school-1', email: 'test@test.com' }
      });
      
      expect(prisma.schoolUser.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          schoolId: 'school-1',
          email: 'test@test.com',
          role: 'SCHOOL_ADMIN'
        })
      }));
    });
  });
});

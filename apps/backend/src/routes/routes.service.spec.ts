import { BadRequestException } from '@nestjs/common';
import { RoutesService } from './routes.service';

describe('RoutesService tenant isolation', () => {
  let service: RoutesService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      bus: { findFirst: jest.fn() },
      student: { findFirst: jest.fn() },
      routeStop: { findFirst: jest.fn() },
      routeStudent: { findFirst: jest.fn(), create: jest.fn() },
      route: { update: jest.fn() },
    };
    service = new RoutesService(prisma);
    jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'route-a' } as any);
  });

  it('rejects assigning a student from another school', async () => {
    prisma.student.findFirst.mockResolvedValue(null);

    await expect(
      service.assignStudent('school-a', 'route-a', 'student-b'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.routeStudent.create).not.toHaveBeenCalled();
  });

  it('rejects a stop that is not on the route in the tenant', async () => {
    prisma.student.findFirst.mockResolvedValue({ id: 'student-a' });
    prisma.routeStop.findFirst.mockResolvedValue(null);

    await expect(
      service.assignStudent('school-a', 'route-a', 'student-a', 'stop-b'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.routeStudent.create).not.toHaveBeenCalled();
  });

  it('does not pass tenant-controlled fields through an update', async () => {
    prisma.route.update.mockResolvedValue({ id: 'route-a' });

    await service.update('school-a', 'route-a', {
      nameAr: 'Route',
      schoolId: 'school-b',
      deletedAt: new Date(),
    });

    expect(prisma.route.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          schoolId: expect.anything(),
          deletedAt: expect.anything(),
        }),
      }),
    );
  });
});

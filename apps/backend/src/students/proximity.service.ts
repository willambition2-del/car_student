import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateDistanceMeters } from '../common/utils/geo.util';
import { Prisma } from '@prisma/client';
import { assertSchoolOperational } from '../common/utils/tenant-safety.util';

@Injectable()
export class ProximityService {
  private readonly logger = new Logger(ProximityService.name);
  
  constructor(private prisma: PrismaService) {}

  /**
   * Finds students near a given target point within a specific radius.
   * Enforces Tenant Isolation by restricting the search to the provided schoolId.
   *
   * @param schoolId The school tenant ID
   * @param targetLat Latitude of the target point
   * @param targetLon Longitude of the target point
   * @param radiusMeters The maximum distance in meters (e.g., 500)
   * @param maxCapacity Bus capacity for checking overflow
   * @returns Array of nearby students with their distance, and overflow flag
   */
  async findStudentsNearPoint(
    schoolId: string,
    targetLat: number,
    targetLon: number,
    radiusMeters: number = 500,
    maxCapacity: number = 30,
  ) {
    // 1. Verify school operational status
    await assertSchoolOperational(this.prisma, schoolId);

    // 2. Get all active students with transportStatus = 'ACTIVE' and their primary locations (HOME & PICKUP)
    const locations = await this.prisma.studentLocation.findMany({
      where: {
        student: {
          schoolId,
          isActive: true,
          deletedAt: null,
          transportStatus: 'ACTIVE',
        },
        isPrimary: true,
        isActive: true,
        locationType: {
          in: ['HOME', 'PICKUP'],
        }
      },
      include: {
        student: true,
      },
    });

    const nearbyStudents = [];
    const processedStudents = new Set<string>();

    // 2. Iterate and apply Haversine distance
    // We group by student to prioritize PICKUP over HOME
    const locationMap = new Map<string, any[]>();
    for (const loc of locations) {
      if (!loc.latitude || !loc.longitude) continue;
      if (!locationMap.has(loc.studentId)) locationMap.set(loc.studentId, []);
      locationMap.get(loc.studentId)!.push(loc);
    }

    for (const [studentId, studentLocs] of locationMap.entries()) {
      let chosenLoc = studentLocs.find(l => l.locationType === 'PICKUP');
      if (!chosenLoc) {
        chosenLoc = studentLocs.find(l => l.locationType === 'HOME');
      }
      if (!chosenLoc) continue;

      const distance = calculateDistanceMeters(
        targetLat,
        targetLon,
        Number(chosenLoc.latitude),
        Number(chosenLoc.longitude),
      );

      if (distance <= radiusMeters) {
        nearbyStudents.push({
          student: chosenLoc.student,
          location: chosenLoc,
          distanceMeters: Math.round(distance),
        });
      }
    }

    // 3. Sort by distance ascending
    nearbyStudents.sort((a, b) => a.distanceMeters - b.distanceMeters);
    
    // 4. Capacity Flag (Suggestion only, no final assignment)
    const isOverflow = nearbyStudents.length > maxCapacity;

    return {
      candidates: nearbyStudents,
      isOverflow,
      message: isOverflow ? `تحذير: عدد الطلاب (${nearbyStudents.length}) يتجاوز سعة الحافلة (${maxCapacity}). يُقترح تقسيم التجمع.` : 'ضمن السعة',
    };
  }
}

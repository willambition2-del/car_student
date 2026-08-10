import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../mock/models/models.dart';
import 'status_badge.dart';

class BusCard extends StatelessWidget {
  final BusModel bus;
  final VoidCallback? onTap;

  const BusCard({super.key, required this.bus, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.borderLg,
        child: Padding(
          padding: const EdgeInsets.all(14.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: AppColors.primarySoft,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.directions_bus_rounded,
                          color: AppColors.primaryNavy,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'حافلة رقم ${bus.busNumber}',
                            style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                          ),
                          Text(
                            'اللوحة: ${bus.plateNumber}',
                            style: AppTypography.caption,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const StatusBadge(label: 'نشطة', colorType: 'green'),
                ],
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 10.0),
                child: Divider(height: 1, color: AppColors.divider),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'السائق: ${bus.driverName}',
                      style: AppTypography.bodySmall.copyWith(color: AppColors.mainText),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      'المشرفة: ${bus.supervisorName}',
                      style: AppTypography.bodySmall.copyWith(color: AppColors.mainText),
                      textAlign: TextAlign.end,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TripCard extends StatelessWidget {
  final TripModel trip;
  final VoidCallback? onTap;

  const TripCard({super.key, required this.trip, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.borderLg,
        child: Padding(
          padding: const EdgeInsets.all(14.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.route_rounded,
                        color: AppColors.primaryNavy,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        trip.tripType,
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  StatusBadge(
                    label: trip.status.label,
                    colorType: trip.status.colorType,
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'المسار: ${trip.routeName} • حافلة ${trip.busNumber}',
                style: AppTypography.bodySmall.copyWith(color: AppColors.secondaryText),
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.access_time_rounded,
                        size: 15,
                        color: AppColors.mutedText,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'الوقت: ${trip.startTime}',
                        style: AppTypography.caption,
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(
                        Icons.people_alt_rounded,
                        size: 15,
                        color: AppColors.mutedText,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'الطلاب: ${trip.boardedCount} / ${trip.totalStudents}',
                        style: AppTypography.caption.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.primaryNavy,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

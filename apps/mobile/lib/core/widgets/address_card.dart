import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../mock/models/models.dart';
import 'status_badge.dart';

class AddressCard extends StatelessWidget {
  final AddressRequestModel request;
  final VoidCallback? onTap;

  const AddressCard({super.key, required this.request, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
                  Text(
                    request.studentName,
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  StatusBadge(
                    label: request.status.label,
                    colorType: request.status == RequestStatus.approved
                        ? 'green'
                        : request.status == RequestStatus.rejected
                            ? 'red'
                            : 'orange',
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'نوع الطلب: ${request.type.label}',
                style: AppTypography.caption.copyWith(
                  color: AppColors.primaryNavy,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    color: AppColors.primaryNavy,
                    size: 16,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'الموقع الجديد: ${request.newAddress}',
                      style: AppTypography.bodySmall.copyWith(color: AppColors.mainText),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'تاريخ الطلب: ${request.startDate}',
                style: AppTypography.caption,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

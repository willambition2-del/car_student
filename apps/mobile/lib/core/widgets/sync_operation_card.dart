import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../mock/models/models.dart';
import 'status_badge.dart';

class SyncOperationCard extends StatelessWidget {
  final SyncOperationModel operation;
  final VoidCallback? onRetry;

  const SyncOperationCard({super.key, required this.operation, this.onRetry});

  @override
  Widget build(BuildContext context) {
    final isSynced = operation.status == 'تمت المزامنة';
    final isPending = operation.status == 'بانتظار الإرسال';

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'الطالب: ${operation.studentName}',
                  style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                ),
                StatusBadge(
                  label: operation.status,
                  colorType: isSynced
                      ? 'green'
                      : isPending
                          ? 'orange'
                          : 'red',
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              'الإجراء: ${operation.actionType} (${operation.previousState} ⬅️ ${operation.newState})',
              style: AppTypography.bodySmall.copyWith(color: AppColors.secondaryText),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'الوقت: ${operation.timestamp}',
                  style: AppTypography.caption,
                ),
                if (!isSynced && onRetry != null)
                  InkWell(
                    onTap: onRetry,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      child: Row(
                        children: [
                          const Icon(Icons.refresh_rounded, size: 14, color: AppColors.primaryNavy),
                          const SizedBox(width: 4),
                          Text(
                            'إعادة المحاولة',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.primaryNavy,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

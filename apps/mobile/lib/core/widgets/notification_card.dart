import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../mock/models/models.dart';

class NotificationCard extends StatelessWidget {
  final NotificationItemModel notification;
  final VoidCallback? onTap;

  const NotificationCard({super.key, required this.notification, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: notification.isRead ? AppColors.surface : AppColors.primarySoft,
        borderRadius: AppRadius.borderLg,
        border: Border.all(
          color: notification.isRead ? AppColors.border : AppColors.primaryBorder,
          width: 1,
        ),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.notifications_active_rounded,
            color: AppColors.primaryNavy,
            size: 20,
          ),
        ),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                notification.title,
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: notification.isRead ? FontWeight.w500 : FontWeight.w700,
                  color: AppColors.mainText,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              notification.time,
              style: AppTypography.caption.copyWith(color: AppColors.mutedText),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4.0),
          child: Text(
            notification.body,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.secondaryText,
            ),
          ),
        ),
      ),
    );
  }
}

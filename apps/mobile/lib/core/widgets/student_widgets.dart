import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../mock/models/models.dart';
import 'status_badge.dart';

class StudentAvatar extends StatelessWidget {
  final String name;
  final double size;
  final String? avatarUrl;

  const StudentAvatar({
    super.key,
    required this.name,
    this.size = 44,
    this.avatarUrl,
  });

  @override
  Widget build(BuildContext context) {
    final initials = name.trim().isNotEmpty
        ? name.trim().split(' ').map((e) => e[0]).take(2).join()
        : 'ط';

    return Container(
      width: size,
      height: size,
      decoration: const BoxDecoration(
        color: AppColors.primarySoft,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        initials,
        style: AppTypography.titleSmall.copyWith(
          color: AppColors.primaryNavy,
          fontWeight: FontWeight.w700,
          fontSize: size * 0.38,
        ),
      ),
    );
  }
}

class StudentCard extends StatelessWidget {
  final StudentModel student;
  final bool isSelected;
  final VoidCallback? onTap;

  const StudentCard({
    super.key,
    required this.student,
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadius.borderLg,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primarySoft : AppColors.surface,
          borderRadius: AppRadius.borderLg,
          border: Border.all(
            color: isSelected ? AppColors.primaryNavy : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            StudentAvatar(name: student.name, size: 44),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    student.name,
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${student.grade} • ${student.section}',
                    style: AppTypography.caption.copyWith(color: AppColors.secondaryText),
                  ),
                  Text(
                    student.schoolName,
                    style: AppTypography.caption.copyWith(color: AppColors.mutedText),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            StatusBadge(
              label: student.currentStatus.label,
              colorType: student.currentStatus.colorType,
            ),
          ],
        ),
      ),
    );
  }
}

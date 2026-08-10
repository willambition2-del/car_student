import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';

class DateSelector extends StatelessWidget {
  final String label;
  final String selectedDate;
  final VoidCallback onTap;

  const DateSelector({
    super.key,
    required this.label,
    required this.selectedDate,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label,
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.mainText,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),
        InkWell(
          onTap: onTap,
          borderRadius: AppRadius.borderLg,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: AppRadius.borderLg,
              border: Border.all(color: AppColors.border, width: 1),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  selectedDate.isEmpty ? 'اختر التاريخ' : selectedDate,
                  style: AppTypography.bodyMedium.copyWith(
                    color: selectedDate.isEmpty
                        ? AppColors.mutedText
                        : AppColors.mainText,
                  ),
                ),
                const Icon(
                  Icons.calendar_today_rounded,
                  color: AppColors.primaryNavy,
                  size: 18,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

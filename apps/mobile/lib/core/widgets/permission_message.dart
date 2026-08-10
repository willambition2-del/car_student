import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import 'app_buttons.dart';

class PermissionMessage extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final VoidCallback onRequestPermission;

  const PermissionMessage({
    super.key,
    required this.title,
    required this.description,
    this.icon = Icons.location_off_rounded,
    required this.onRequestPermission,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.warningAmberSoft,
              borderRadius: AppRadius.borderLg,
              border: Border.all(color: AppColors.warningAmberBorder, width: 1),
            ),
            child: Icon(icon, size: 32, color: AppColors.warningAmber),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: AppTypography.titleLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          Text(
            description,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.secondaryText,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: 200,
            child: PrimaryButton(
              text: 'منح الصلاحية الآن',
              onPressed: onRequestPermission,
              height: 44,
            ),
          ),
        ],
      ),
    );
  }
}

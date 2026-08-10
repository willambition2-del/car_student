import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';

class StatusBadge extends StatelessWidget {
  final String label;
  final String colorType; // green, red, orange, blue, navy, gray
  final IconData? icon;

  const StatusBadge({
    super.key,
    required this.label,
    required this.colorType,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color text;
    Color border;

    switch (colorType) {
      case 'green':
        bg = AppColors.successGreenSoft;
        text = AppColors.successGreen;
        border = AppColors.successGreenBorder;
        break;
      case 'red':
        bg = AppColors.errorRedSoft;
        text = AppColors.errorRed;
        border = AppColors.errorRedBorder;
        break;
      case 'orange':
      case 'amber':
        bg = AppColors.warningAmberSoft;
        text = AppColors.warningAmber;
        border = AppColors.warningAmberBorder;
        break;
      case 'blue':
        bg = AppColors.infoBlueSoft;
        text = AppColors.infoBlue;
        border = AppColors.infoBlueBorder;
        break;
      case 'navy':
        bg = AppColors.primarySoft;
        text = AppColors.primaryNavy;
        border = AppColors.primaryBorder;
        break;
      default:
        bg = AppColors.inactiveGraySoft;
        text = AppColors.inactiveGray;
        border = AppColors.border;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.borderSm,
        border: Border.all(color: border, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 13, color: text),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: AppTypography.caption.copyWith(
              color: text,
              fontWeight: FontWeight.w600,
              height: 1.1,
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import 'app_buttons.dart';

class LoadingState extends StatelessWidget {
  final String message;
  const LoadingState({super.key, this.message = 'جاري التحميل...'});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(
              color: AppColors.primaryNavy,
              strokeWidth: 2.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            message,
            style: AppTypography.bodySmall.copyWith(color: AppColors.secondaryText),
          ),
        ],
      ),
    );
  }
}

class EmptyState extends StatelessWidget {
  final String title;
  final String message;
  final IconData icon;
  final String? buttonText;
  final VoidCallback? onButtonPressed;

  const EmptyState({
    super.key,
    required this.title,
    required this.message,
    this.icon = Icons.inbox_outlined,
    this.buttonText,
    this.onButtonPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.primaryBorder, width: 1),
              ),
              child: Icon(icon, size: 32, color: AppColors.primaryNavy),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: AppTypography.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              message,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.secondaryText,
              ),
              textAlign: TextAlign.center,
            ),
            if (buttonText != null && onButtonPressed != null) ...[
              const SizedBox(height: 20),
              SizedBox(
                width: 180,
                child: PrimaryButton(
                  text: buttonText!,
                  onPressed: onButtonPressed,
                  height: 44,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class ErrorState extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback? onRetry;

  const ErrorState({
    super.key,
    this.title = 'تعذر تحميل البيانات',
    required this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.errorRedSoft,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.errorRedBorder, width: 1),
              ),
              child: const Icon(
                Icons.error_outline_rounded,
                size: 32,
                color: AppColors.errorRed,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: AppTypography.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              message,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.secondaryText,
              ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 20),
              SizedBox(
                width: 160,
                child: OutlineButton(
                  text: 'إعادة المحاولة',
                  onPressed: onRetry,
                  height: 44,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class SkeletonLoading extends StatelessWidget {
  final double height;
  final double width;
  final BorderRadius? borderRadius;

  const SkeletonLoading({
    super.key,
    required this.height,
    this.width = double.infinity,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
        color: AppColors.inactiveGraySoft,
        borderRadius: borderRadius ?? AppRadius.borderMd,
      ),
    );
  }
}

class OfflineBanner extends StatelessWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.warningAmberSoft,
        border: Border(bottom: BorderSide(color: AppColors.warningAmberBorder, width: 1)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Icon(
            Icons.wifi_off_rounded,
            color: AppColors.warningAmber,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'غير متصل — سيتم حفظ العمليات ومزامنتها تلقائيًا',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.mainText,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SyncStatusBanner extends StatelessWidget {
  final int pendingCount;
  final VoidCallback? onSyncPressed;

  const SyncStatusBanner({
    super.key,
    required this.pendingCount,
    this.onSyncPressed,
  });

  @override
  Widget build(BuildContext context) {
    if (pendingCount <= 0) return const SizedBox.shrink();

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.infoBlueSoft,
        border: Border(bottom: BorderSide(color: AppColors.infoBlueBorder, width: 1)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Icon(Icons.sync_rounded, color: AppColors.infoBlue, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'يوجد $pendingCount عملية بانتظار المزامنة تلقائيًا',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.mainText,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          if (onSyncPressed != null)
            InkWell(
              onTap: onSyncPressed,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: Text(
                  'مزامنة الآن',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.infoBlue,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

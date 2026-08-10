import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';

class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String? subtitle;
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  final List<Widget>? actions;
  final bool showBottomBorder;

  const AppTopBar({
    super.key,
    required this.title,
    this.subtitle,
    this.showBackButton = true,
    this.onBackPressed,
    this.actions,
    this.showBottomBorder = true,
  });

  @override
  Widget build(BuildContext context) {
    final canGoBack = showBackButton && (onBackPressed != null || context.canPop());

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: showBottomBorder
            ? const Border(bottom: BorderSide(color: AppColors.border, width: 1))
            : null,
      ),
      child: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              title,
              style: AppTypography.titleLarge.copyWith(
                color: AppColors.mainText,
                fontWeight: FontWeight.w700,
              ),
            ),
            if (subtitle != null && subtitle!.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                subtitle!,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.secondaryText,
                ),
              ),
            ],
          ],
        ),
        centerTitle: false,
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        leadingWidth: canGoBack ? 48 : 16,
        leading: canGoBack
            ? IconButton(
                icon: const Icon(
                  Icons.arrow_back_rounded,
                  color: AppColors.mainText,
                  size: 22,
                ),
                onPressed: onBackPressed ?? () => context.pop(),
                tooltip: 'رجوع',
              )
            : const SizedBox.shrink(),
        actions: actions != null
            ? [
                ...actions!,
                const SizedBox(width: 8),
              ]
            : null,
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(subtitle != null ? 64 : 56);
}

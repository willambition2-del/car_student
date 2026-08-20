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

  void _handleBack(BuildContext context) {
    if (onBackPressed != null) {
      onBackPressed!();
      return;
    }
    if (context.canPop()) {
      context.pop();
      return;
    }
    final currentLoc = GoRouterState.of(context).matchedLocation;
    if (currentLoc.startsWith('/parent')) {
      context.go('/parent/home');
    } else if (currentLoc.startsWith('/supervisor')) {
      context.go('/supervisor/home');
    } else if (currentLoc.startsWith('/transport')) {
      context.go('/transport/home');
    } else {
      context.go('/auth/login');
    }
  }

  @override
  Widget build(BuildContext context) {
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
        leadingWidth: showBackButton ? 48 : 16,
        leading: showBackButton
            ? IconButton(
                icon: const Icon(
                  Icons.arrow_back_rounded,
                  color: AppColors.mainText,
                  size: 22,
                ),
                onPressed: () => _handleBack(context),
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

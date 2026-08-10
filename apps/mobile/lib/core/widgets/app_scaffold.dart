import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import 'app_top_bar.dart';
import 'role_switcher_card.dart';

class AppScaffold extends StatelessWidget {
  final String? title;
  final String? subtitle;
  final Widget body;
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  final List<Widget>? actions;
  final Widget? bottomNavigationBar;
  final Widget? floatingActionButton;
  final bool showRoleSwitcher;
  final EdgeInsetsGeometry? padding;
  final PreferredSizeWidget? customAppBar;

  const AppScaffold({
    super.key,
    this.title,
    this.subtitle,
    required this.body,
    this.showBackButton = true,
    this.onBackPressed,
    this.actions,
    this.bottomNavigationBar,
    this.floatingActionButton,
    this.showRoleSwitcher = true,
    this.padding,
    this.customAppBar,
  });

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: customAppBar ??
            (title != null
                ? AppTopBar(
                    title: title!,
                    subtitle: subtitle,
                    showBackButton: showBackButton,
                    onBackPressed: onBackPressed,
                    actions: actions,
                  )
                : null),
        body: SafeArea(
          child: Column(
            children: [
              if (showRoleSwitcher) const RoleSwitcherCard(),
              Expanded(
                child: Padding(
                  padding: padding ?? const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  child: body,
                ),
              ),
            ],
          ),
        ),
        bottomNavigationBar: bottomNavigationBar,
        floatingActionButton: floatingActionButton,
      ),
    );
  }
}

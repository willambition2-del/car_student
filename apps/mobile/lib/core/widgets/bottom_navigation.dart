import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';

class RoleBottomNavigation extends ConsumerWidget {
  final String currentRoute;

  const RoleBottomNavigation({super.key, required this.currentRoute});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = ref.watch(selectedRoleProvider);

    List<_NavItem> items = [];
    switch (role) {
      case UserRole.parent:
        items = [
          _NavItem(
            label: 'الرئيسية',
            icon: Icons.home_outlined,
            activeIcon: Icons.home_rounded,
            route: '/parent/home',
          ),
          _NavItem(
            label: 'السجل',
            icon: Icons.history_outlined,
            activeIcon: Icons.history_rounded,
            route: '/parent/trip-history',
          ),
          _NavItem(
            label: 'الإشعارات',
            icon: Icons.notifications_outlined,
            activeIcon: Icons.notifications_rounded,
            route: '/parent/notifications',
          ),
          _NavItem(
            label: 'الحساب',
            icon: Icons.person_outline_rounded,
            activeIcon: Icons.person_rounded,
            route: '/parent/profile',
          ),
        ];
        break;
      case UserRole.supervisor:
        items = [
          _NavItem(
            label: 'الرئيسية',
            icon: Icons.dashboard_outlined,
            activeIcon: Icons.dashboard_rounded,
            route: '/supervisor/home',
          ),
          _NavItem(
            label: 'الرحلة الحالية',
            icon: Icons.directions_bus_outlined,
            activeIcon: Icons.directions_bus_rounded,
            route: '/supervisor/trip/active',
          ),
          _NavItem(
            label: 'المزامنة',
            icon: Icons.sync_outlined,
            activeIcon: Icons.sync_rounded,
            route: '/supervisor/sync',
          ),
          _NavItem(
            label: 'الحساب',
            icon: Icons.person_outline_rounded,
            activeIcon: Icons.person_rounded,
            route: '/shared/profile',
          ),
        ];
        break;
      case UserRole.driver:
        items = [
          _NavItem(
            label: 'الرئيسية',
            icon: Icons.home_outlined,
            activeIcon: Icons.home_rounded,
            route: '/driver/home',
          ),
          _NavItem(
            label: 'الرحلة',
            icon: Icons.navigation_outlined,
            activeIcon: Icons.navigation_rounded,
            route: '/driver/trip/active',
          ),
          _NavItem(
            label: 'البلاغات',
            icon: Icons.report_problem_outlined,
            activeIcon: Icons.report_problem_rounded,
            route: '/driver/reports',
          ),
          _NavItem(
            label: 'الحساب',
            icon: Icons.person_outline_rounded,
            activeIcon: Icons.person_rounded,
            route: '/shared/profile',
          ),
        ];
        break;
      case UserRole.transportManager:
        items = [
          _NavItem(
            label: 'الرئيسية',
            icon: Icons.analytics_outlined,
            activeIcon: Icons.analytics_rounded,
            route: '/transport/home',
          ),
          _NavItem(
            label: 'التشغيل',
            icon: Icons.center_focus_strong_outlined,
            activeIcon: Icons.center_focus_strong_rounded,
            route: '/transport/operations',
          ),
          _NavItem(
            label: 'الطلبات',
            icon: Icons.assignment_outlined,
            activeIcon: Icons.assignment_rounded,
            route: '/transport/address-requests',
          ),
          _NavItem(
            label: 'الحساب',
            icon: Icons.person_outline_rounded,
            activeIcon: Icons.person_rounded,
            route: '/shared/profile',
          ),
        ];
        break;
    }

    int currentIndex = items.indexWhere(
      (item) => currentRoute.startsWith(item.route),
    );
    if (currentIndex == -1) currentIndex = 0;

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.border, width: 1)),
      ),
      child: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (index) {
          context.go(items[index].route);
        },
        backgroundColor: AppColors.surface,
        elevation: 0,
        indicatorColor: AppColors.primarySoft,
        height: 64,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: items.map((item) {
          return NavigationDestination(
            icon: Icon(item.icon, color: AppColors.secondaryText, size: 22),
            selectedIcon: Icon(item.activeIcon, color: AppColors.primaryNavy, size: 22),
            label: item.label,
          );
        }).toList(),
      ),
    );
  }
}

class _NavItem {
  final String label;
  final IconData icon;
  final IconData activeIcon;
  final String route;

  _NavItem({
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.route,
  });
}

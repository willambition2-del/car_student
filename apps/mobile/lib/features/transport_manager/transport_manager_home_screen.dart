import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/section_header.dart';
import '../../mock/mock_repository.dart';

class TransportManagerHomeScreen extends ConsumerWidget {
  const TransportManagerHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppScaffold(
      title: 'مركز تشغيل وإدارة النقل',
      subtitle: 'الرقابة الميدانية ومتابعة حركة الأسطول والرحلات',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/transport/home',
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'مرحبًا، ${MockData.currentTransportManagerName}',
              style: AppTypography.headlineLarge.copyWith(fontSize: 18, color: AppColors.primaryNavy),
            ),
            Text(
              'إحصائيات التشغيل الميداني لـ مدرسة المستقبل الأهلية',
              style: AppTypography.caption,
            ),
            const SizedBox(height: 14),

            // Operational Dashboard Metrics Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.5,
              children: [
                _MetricTile(
                  title: 'الحافلات النشطة',
                  value: '18 / 20',
                  icon: Icons.directions_bus_outlined,
                  color: AppColors.primaryNavy,
                ),
                _MetricTile(
                  title: 'رحلات اليوم',
                  value: '36 رحلة',
                  icon: Icons.route_outlined,
                  color: AppColors.primaryNavy,
                ),
                _MetricTile(
                  title: 'تأخيرات في المسار',
                  value: '1 رحلة',
                  icon: Icons.warning_amber_outlined,
                  color: AppColors.warningAmber,
                ),
                _MetricTile(
                  title: 'طلبات تغيير العنوان',
                  value: '2 جديدة',
                  icon: Icons.edit_location_alt_outlined,
                  color: AppColors.primaryNavy,
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Management Shortcuts
            SectionHeader(title: 'أدوات الرقابة والتشغيل'),
            const SizedBox(height: 8),

            _ToolTile(
              title: 'مركز التشغيل والرقابة المباشرة',
              subtitle: 'خريطة تتبع حية لأسطول الحافلات والطلاب',
              icon: Icons.center_focus_strong_outlined,
              onTap: () => context.go('/transport/operations'),
            ),
            const SizedBox(height: 8),

            _ToolTile(
              title: 'مراجعة طلبات تغيير العنوان',
              subtitle: 'معالجة طلبات تغيير السكن وإعادة ضبط المسارات',
              icon: Icons.assignment_turned_in_outlined,
              onTap: () => context.go('/transport/address-requests'),
            ),
            const SizedBox(height: 8),

            _ToolTile(
              title: 'تنبيهات النظام ومراقبة المزامنة',
              subtitle: 'تنبيهات الأعطال والعمليات المعلقة',
              icon: Icons.notifications_active_outlined,
              onTap: () => context.push('/transport/alerts'),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricTile extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _MetricTile({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 22),
              Text(
                value,
                style: AppTypography.titleLarge.copyWith(
                  color: color,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: AppTypography.caption.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class _ToolTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  const _ToolTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: AppColors.primarySoft,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppColors.primaryNavy, size: 20),
        ),
        title: Text(
          title,
          style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitle,
          style: AppTypography.caption,
        ),
        trailing: const Icon(Icons.chevron_left_rounded, color: AppColors.primaryNavy, size: 20),
      ),
    );
  }
}

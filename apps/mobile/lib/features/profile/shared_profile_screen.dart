import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/dialogs_sheets.dart';
import '../../mock/mock_repository.dart';

class SharedProfileScreen extends ConsumerWidget {
  const SharedProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = ref.watch(selectedRoleProvider);

    return AppScaffold(
      title: 'الإعدادات والملف الشخصي',
      subtitle: 'إدارة الحساب والأمان ولغة التطبيق',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/shared/profile',
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(
                      color: AppColors.primarySoft,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      color: AppColors.primaryNavy,
                      size: 26,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'حساب الموظف (${role.label})',
                          style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'مدرسة المستقبل الأهلية • SaaS Transport',
                          style: AppTypography.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(
                      Icons.lock_outline_rounded,
                      color: AppColors.primaryNavy,
                      size: 20,
                    ),
                    title: Text(
                      'تغيير كلمة المرور',
                      style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    trailing: const Icon(
                      Icons.chevron_left_rounded,
                      color: AppColors.primaryNavy,
                      size: 20,
                    ),
                    onTap: () => context.push('/auth/reset-password'),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  ListTile(
                    leading: const Icon(
                      Icons.language_rounded,
                      color: AppColors.primaryNavy,
                      size: 20,
                    ),
                    title: Text(
                      'لغة الواجهة',
                      style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    trailing: Text(
                      'العربية',
                      style: AppTypography.caption.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryNavy,
                      ),
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  ListTile(
                    leading: const Icon(
                      Icons.headset_mic_outlined,
                      color: AppColors.primaryNavy,
                      size: 20,
                    ),
                    title: Text(
                      'الدعم الفني والخدمات',
                      style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    trailing: const Icon(
                      Icons.chevron_left_rounded,
                      color: AppColors.primaryNavy,
                      size: 20,
                    ),
                    onTap: () => context.push('/shared/support'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            DangerButton(
              text: 'تسجيل الخروج',
              icon: Icons.logout_rounded,
              onPressed: () {
                AppDialog.show(
                  context: context,
                  title: 'تسجيل الخروج',
                  content: 'هل أنت تأكد من رغبتك في تسجيل الخروج؟',
                  confirmText: 'تأكيد الخروج',
                  onConfirm: () => context.go('/auth/login'),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

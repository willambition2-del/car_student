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

class ParentProfileScreen extends ConsumerStatefulWidget {
  const ParentProfileScreen({super.key});

  @override
  ConsumerState<ParentProfileScreen> createState() =>
      _ParentProfileScreenState();
}

class _ParentProfileScreenState extends ConsumerState<ParentProfileScreen> {
  bool _tripAlerts = true;
  bool _addressAlerts = true;

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'الملف الشخصي والإعدادات',
      subtitle: 'تفضيلات الإشعارات والبيانات الشخصية',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/parent/profile',
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
                    width: 50,
                    height: 50,
                    decoration: const BoxDecoration(
                      color: AppColors.primarySoft,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      color: AppColors.primaryNavy,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          MockData.currentParentName,
                          style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '0501234567 • parent@school.com',
                          style: AppTypography.caption,
                        ),
                        Text(
                          'ولي أمر طالبيَن في مدرسة المستقبل',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.primaryNavy,
                            fontWeight: FontWeight.w600,
                          ),
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
                  SwitchListTile(
                    title: Text(
                      'إشعارات صعود ونزول الرحلات',
                      style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(
                      'التنبيه الفوري عند تسجيل صعود أو وصول الطالب',
                      style: AppTypography.caption,
                    ),
                    value: _tripAlerts,
                    activeTrackColor: AppColors.primaryNavy,
                    onChanged: (val) => setState(() => _tripAlerts = val),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  SwitchListTile(
                    title: Text(
                      'إشعارات طلبات تغيير العنوان',
                      style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(
                      'متابعة حالة قبول أو موافقة الطلبات المرفوعة',
                      style: AppTypography.caption,
                    ),
                    value: _addressAlerts,
                    activeTrackColor: AppColors.primaryNavy,
                    onChanged: (val) => setState(() => _addressAlerts = val),
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
                      Icons.language_rounded,
                      color: AppColors.primaryNavy,
                      size: 20,
                    ),
                    title: Text(
                      'لغة التطبيق',
                      style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    trailing: Text(
                      'العربية (افتراضي)',
                      style: AppTypography.caption.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryNavy,
                      ),
                    ),
                    onTap: () {},
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
                  content: 'هل أنت تأكد من رغبتك في تسجيل الخروج من الحساب؟',
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

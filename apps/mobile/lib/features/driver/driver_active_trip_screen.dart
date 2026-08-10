import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/map_widgets.dart';

class DriverActiveTripScreen extends ConsumerWidget {
  const DriverActiveTripScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppScaffold(
      title: 'ملاحة الرحلة الحية للسائق',
      subtitle: 'توجيهات الطريق ومحطات التجمع الحالية',
      showBackButton: false,
      padding: EdgeInsets.zero,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/driver/trip/active',
      ),
      body: Stack(
        children: [
          const MapPlaceholder(
            title: 'ملاحة توجيهية حية للحافلة 205',
            subtitle: 'المحطة التالية: محطة 3 - شارع النور',
          ),
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.primaryNavy,
                borderRadius: AppRadius.borderLg,
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: AppColors.primarySoft,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.turn_right_rounded,
                      color: AppColors.primaryNavy,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'بعد 200 متر: انعطف يمينًا',
                          style: AppTypography.titleMedium.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          'شارع السلام • المحطة التالية: محطة حي الهدى (3)',
                          style: AppTypography.caption.copyWith(
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: 12,
            left: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _DriveStat(
                        label: 'سرعة المركبة',
                        value: '42 كم/س',
                        color: AppColors.primaryNavy,
                      ),
                      Container(width: 1, height: 24, color: AppColors.divider),
                      _DriveStat(
                        label: 'وصول متوقع',
                        value: '07:45 ص',
                        color: AppColors.mainText,
                      ),
                      Container(width: 1, height: 24, color: AppColors.divider),
                      _DriveStat(
                        label: 'المحطة الحالية',
                        value: 'محطة 3',
                        color: AppColors.successGreen,
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: DangerButton(
                          text: 'بلاغ عطل/تأخير',
                          icon: Icons.warning_amber_rounded,
                          height: 42,
                          onPressed: () => context.push('/driver/reports'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: PrimaryButton(
                          text: 'إنهاء الملاحة',
                          icon: Icons.check_circle_outline_rounded,
                          height: 42,
                          onPressed: () => context.go('/driver/home'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DriveStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _DriveStat({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: AppTypography.titleMedium.copyWith(
            color: color,
            fontWeight: FontWeight.w700,
          ),
        ),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}

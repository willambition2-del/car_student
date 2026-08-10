import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class DriverHomeScreen extends ConsumerWidget {
  const DriverHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(activeTripProvider).when(
      data: (trip) {
        
    
    final bus = MockData.activeBus;

    return AppScaffold(
      title: 'واجهة السائق الميداني',
      subtitle: 'الملاحة ومتابعة مسار الحافلة والطريق',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/driver/home',
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Driver Vehicle Header Strip
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _MetricItem(label: 'رقم الحافلة', value: bus.busNumber),
                  Container(width: 1, height: 24, color: AppColors.divider),
                  _MetricItem(label: 'رقم اللوحة', value: bus.plateNumber),
                  Container(width: 1, height: 24, color: AppColors.divider),
                  _MetricItem(label: 'السعة', value: '${bus.capacity} مقعد'),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Main Route Navigation Card (Section 20)
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.navigation_outlined,
                            color: AppColors.primaryNavy,
                            size: 22,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            trip.tripType,
                            style: AppTypography.titleLarge.copyWith(
                              fontSize: 16,
                              color: AppColors.primaryNavy,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const StatusBadge(label: 'جاهز للانطلاق', colorType: 'green'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'مسار الطريق: ${trip.routeName}',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  Text(
                    'المشرفة المرافقة: ${MockData.currentSupervisorName} (${trip.supervisorName})',
                    style: AppTypography.caption,
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _MetricItem(
                        label: 'المحطة القادمة',
                        value: 'حي النور (محطة 1)',
                        color: AppColors.primaryNavy,
                      ),
                      Container(width: 1, height: 28, color: AppColors.divider),
                      _MetricItem(
                        label: 'إجمالي الطلاب للركوب',
                        value: '${trip.totalStudents} طالب',
                        color: AppColors.mainText,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  PrimaryButton(
                    text: 'بدء الملاحة والانطلاق المسار',
                    icon: Icons.play_arrow_rounded,
                    height: 48,
                    onPressed: () => context.push('/driver/trip/active'),
                  ),
                  const SizedBox(height: 10),
                  OutlineButton(
                    text: 'استعراض محطات المسار الخريطة',
                    icon: Icons.map_outlined,
                    height: 44,
                    onPressed: () => context.push('/driver/route-details'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Emergency Incident Button
            DangerButton(
              text: 'إبلاغ طارئ عن عطل أو حادث بالطريق',
              icon: Icons.warning_amber_rounded,
              height: 48,
              onPressed: () => context.push('/driver/reports'),
            ),
          ],
        ),
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

class _MetricItem extends StatelessWidget {
  final String label;
  final String value;
  final Color? color;

  const _MetricItem({
    required this.label,
    required this.value,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: AppTypography.titleSmall.copyWith(
            color: color ?? AppColors.primaryNavy,
            fontWeight: FontWeight.w700,
          ),
        ),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/section_header.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';
import 'services/trip_service.dart';

class SupervisorHomeScreen extends ConsumerWidget {
  const SupervisorHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(syncOperationsProvider).when(
      data: (syncOps) {
        
    return ref.watch(activeTripProvider).when(
      data: (trip) {
        if (trip == null) {
          return AppScaffold(
            title: 'لوحة المشرفة الميدانية',
            showBackButton: false,
            bottomNavigationBar: const RoleBottomNavigation(
              currentRoute: '/supervisor/home',
            ),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.directions_bus_outlined, size: 64, color: AppColors.border),
                  const SizedBox(height: 16),
                  Text('لا توجد رحلة نشطة حالياً', style: AppTypography.titleLarge),
                  const SizedBox(height: 24),
                  PrimaryButton(
                    text: 'عرض الرحلات المجدولة',
                    icon: Icons.list_alt_rounded,
                    width: 250,
                    onPressed: () => context.push('/supervisor/trips'),
                  ),
                ],
              ),
            ),
          );
        }
        
    final pendingOpsCount = syncOps
        .where((s) => s.status != 'تمت المزامنة')
        .length;

    return AppScaffold(
      title: 'لوحة المشرفة الميدانية',
      subtitle: 'إدارة عمليات ركوب ونزول الطلاب للرحلة',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/supervisor/home',
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Bar Row (Online/Offline + Sync Counter)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.successGreen,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'متصل بالشبكة',
                        style: AppTypography.caption.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  InkWell(
                    onTap: () => context.push('/supervisor/sync'),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.sync_rounded,
                          color: AppColors.primaryNavy,
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'المزامنة ($pendingOpsCount معلقة)',
                          style: AppTypography.caption.copyWith(
                            color: AppColors.primaryNavy,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Single Main Operation Card (Section 15)
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
                            Icons.directions_bus_rounded,
                            color: AppColors.primaryNavy,
                            size: 22,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'حافلة رقم ${trip.busNumber}',
                            style: AppTypography.titleLarge.copyWith(
                              fontSize: 18,
                              color: AppColors.primaryNavy,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      StatusBadge(
                        label: trip.status.label,
                        colorType: trip.status.colorType,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'مسار الصباح • ${trip.routeName}',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  Text(
                    'وقت الانطلاق المقرر: ${trip.startTime}',
                    style: AppTypography.caption,
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),

                  // Counters
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatMetric(
                        label: 'إجمالي الطلاب',
                        value: '${trip.totalStudents}',
                        color: AppColors.mainText,
                      ),
                      Container(width: 1, height: 28, color: AppColors.divider),
                      _StatMetric(
                        label: 'صعدوا',
                        value: '${trip.boardedCount}',
                        color: AppColors.successGreen,
                      ),
                      Container(width: 1, height: 28, color: AppColors.divider),
                      _StatMetric(
                        label: 'غائبون',
                        value: '${trip.absentCount}',
                        color: AppColors.warningAmber,
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  PrimaryButton(
                    text: trip.status == TripStatus.inProgress
                        ? 'متابعة تنفيذ الرحلة الحالية'
                        : 'بدء الرحلة الآن',
                    icon: Icons.play_arrow_rounded,
                    height: 50,
                    onPressed: () async {
                      if (trip.status != TripStatus.inProgress) {
                        try {
                          await ref.read(tripServiceProvider).startTrip(trip.id);
                          ref.invalidate(activeTripProvider);
                          ref.invalidate(scheduledTripsProvider);
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('فشل بدء الرحلة: $e')),
                            );
                          }
                          return;
                        }
                      }
                      if (context.mounted) {
                        context.push('/supervisor/trip/active');
                      }
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Scheduled Trips List
            SectionHeader(
              title: 'الرحلات المقررة اليوم',
              actionTitle: 'عرض السجل',
              onActionPressed: () => context.push('/supervisor/trips'),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.route_outlined,
                    color: AppColors.primaryNavy,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'رحلة العودة المسائية • حافلة ${trip.busNumber}',
                          style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          'التوقيت: 01:30 م • تجهيز المحطات',
                          style: AppTypography.caption,
                        ),
                      ],
                    ),
                  ),
                  const StatusBadge(label: 'مجدولة', colorType: 'gray'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

class _StatMetric extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatMetric({
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
          style: AppTypography.titleLarge.copyWith(
            color: color,
            fontWeight: FontWeight.w700,
          ),
        ),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}

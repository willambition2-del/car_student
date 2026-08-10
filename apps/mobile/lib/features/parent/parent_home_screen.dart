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
import '../../core/widgets/student_widgets.dart';
import '../../mock/mock_repository.dart';

class ParentHomeScreen extends ConsumerWidget {
  const ParentHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(notificationsProvider).when(
      data: (notifications) {
        
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final activeStudent = students.isNotEmpty
        ? students[selectedIndex]
        : MockData.students.first;
    

    return AppScaffold(
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/parent/home',
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Welcome Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'مرحبًا، ${MockData.currentParentName}',
                        style: AppTypography.headlineLarge.copyWith(
                          color: AppColors.primaryNavy,
                          fontSize: 20,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'نظام إدارة وتتبع النقل المدرسي المؤسسي',
                        style: AppTypography.caption,
                      ),
                    ],
                  ),
                ),
                Stack(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: AppRadius.borderLg,
                        border: Border.all(color: AppColors.border, width: 1),
                      ),
                      child: IconButton(
                        icon: const Icon(
                          Icons.notifications_none_rounded,
                          color: AppColors.primaryNavy,
                          size: 20,
                        ),
                        onPressed: () => context.go('/parent/notifications'),
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.errorRed,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Horizontal Student Selector
            if (students.length > 1) ...[
              Text(
                'اختيار الابن / الابنة:',
                style: AppTypography.labelMedium,
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 44,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: students.length,
                  separatorBuilder: (context, index) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final student = students[index];
                    final isSelected = index == selectedIndex;
                    return InkWell(
                      onTap: () {
                        ref.read(selectedStudentIndexProvider.notifier).state = index;
                      },
                      borderRadius: AppRadius.borderLg,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primarySoft : AppColors.surface,
                          borderRadius: AppRadius.borderLg,
                          border: Border.all(
                            color: isSelected ? AppColors.primaryNavy : AppColors.border,
                            width: isSelected ? 1.5 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            StudentAvatar(name: student.name, size: 28),
                            const SizedBox(width: 8),
                            Text(
                              student.name,
                              style: AppTypography.titleSmall.copyWith(
                                color: isSelected ? AppColors.primaryNavy : AppColors.mainText,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Active Student Details Strip
            StudentCard(
              student: activeStudent,
              isSelected: false,
              onTap: () => context.push('/parent/student-details'),
            ),
            const SizedBox(height: 16),

            // Today's Transport Status (Timeline Component)
            Container(
              padding: const EdgeInsets.all(16),
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
                            Icons.departure_board_outlined,
                            color: AppColors.primaryNavy,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'حالة النقل اليوم (رحلة الصباح)',
                            style: AppTypography.titleLarge.copyWith(fontSize: 15),
                          ),
                        ],
                      ),
                      const StatusBadge(
                        label: 'في الطريق',
                        colorType: 'blue',
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Horizontal Timeline Steps
                  Row(
                    children: [
                      _TimelineStep(
                        title: 'بدأت الرحلة',
                        time: '07:05 ص',
                        isCompleted: true,
                        isCurrent: false,
                      ),
                      _TimelineDivider(isCompleted: true),
                      _TimelineStep(
                        title: 'صعد الطالب',
                        time: '07:18 ص',
                        isCompleted: true,
                        isCurrent: true,
                      ),
                      _TimelineDivider(isCompleted: false),
                      _TimelineStep(
                        title: 'وصل المدرسة',
                        time: 'المتوقع 07:45',
                        isCompleted: false,
                        isCurrent: false,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'حافلة رقم ${activeStudent.busNumber} • مسار ${activeStudent.routeName}',
                        style: AppTypography.caption,
                      ),
                      AppTextButton(
                        text: 'التفاصيل الكاملة',
                        onPressed: () => context.go('/parent/trip-details'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Quick Actions 2x2 Grid
            Text('الخدمات السريعة', style: AppTypography.titleLarge.copyWith(fontSize: 16)),
            const SizedBox(height: 10),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.6,
              children: [
                _ActionTile(
                  title: 'تسجيل غياب',
                  subtitle: 'إخطار المشرفة بالغياب',
                  icon: Icons.event_busy_outlined,
                  onTap: () => context.push('/parent/absence-request'),
                ),
                _ActionTile(
                  title: 'موقع المنزل',
                  subtitle: 'تحديد نقطة الالتقاط',
                  icon: Icons.edit_location_alt_outlined,
                  onTap: () => context.push('/parent/map-location-picker'),
                ),
                _ActionTile(
                  title: 'بيانات الباص',
                  subtitle: 'المشرفة والسائق والمستندات',
                  icon: Icons.directions_bus_outlined,
                  onTap: () => context.push('/parent/student-details'),
                ),
                _ActionTile(
                  title: 'الرسوم والسندات',
                  subtitle: 'متابعة الدفعات المالية',
                  icon: Icons.account_balance_wallet_outlined,
                  onTap: () => context.push('/parent/student-details'),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Recent Notifications
            SectionHeader(
              title: 'آخر الإشعارات',
              actionTitle: 'عرض الكل',
              onActionPressed: () => context.go('/parent/notifications'),
            ),
            const SizedBox(height: 8),
            ...notifications.take(2).map(
                  (n) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: AppRadius.borderLg,
                      border: Border.all(color: AppColors.border, width: 1),
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
                            Icons.notifications_active_outlined,
                            color: AppColors.primaryNavy,
                            size: 18,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                n.title,
                                style: AppTypography.titleSmall.copyWith(fontSize: 13),
                              ),
                              Text(
                                n.body,
                                style: AppTypography.caption,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          n.time,
                          style: AppTypography.caption.copyWith(color: AppColors.mutedText),
                        ),
                      ],
                    ),
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

class _TimelineStep extends StatelessWidget {
  final String title;
  final String time;
  final bool isCompleted;
  final bool isCurrent;

  const _TimelineStep({
    required this.title,
    required this.time,
    required this.isCompleted,
    required this.isCurrent,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Container(
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              color: isCompleted ? AppColors.primaryNavy : AppColors.surface,
              shape: BoxShape.circle,
              border: Border.all(
                color: isCompleted ? AppColors.primaryNavy : AppColors.border,
                width: 2,
              ),
            ),
            child: isCompleted
                ? const Icon(Icons.check, size: 14, color: Colors.white)
                : null,
          ),
          const SizedBox(height: 6),
          Text(
            title,
            style: AppTypography.caption.copyWith(
              fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500,
              color: isCurrent ? AppColors.primaryNavy : AppColors.mainText,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            time,
            style: AppTypography.caption.copyWith(
              fontSize: 10,
              color: AppColors.mutedText,
            ),
          ),
        ],
      ),
    );
  }
}

class _TimelineDivider extends StatelessWidget {
  final bool isCompleted;

  const _TimelineDivider({required this.isCompleted});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 20,
      height: 2,
      margin: const EdgeInsets.only(bottom: 24),
      color: isCompleted ? AppColors.primaryNavy : AppColors.border,
    );
  }
}

class _ActionTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  const _ActionTile({
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
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.borderLg,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: AppColors.primaryNavy, size: 22),
              const SizedBox(height: 8),
              Text(
                title,
                style: AppTypography.titleSmall.copyWith(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: AppTypography.caption.copyWith(fontSize: 10),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

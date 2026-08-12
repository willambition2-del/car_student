import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/information_row.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class ParentTripDetailsScreen extends ConsumerWidget {
  const ParentTripDetailsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(activeTripProvider).when(
      data: (trip) {
        if (trip == null) {
          return AppScaffold(
            title: 'تفاصيل الرحلة',
            body: Center(
              child: Text('لا توجد رحلة نشطة', style: AppTypography.titleLarge),
            ),
          );
        }
        
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final student = students.isNotEmpty
        ? students[selectedIndex]
        : MockData.students.first;
    

    return AppScaffold(
      title: 'تفاصيل الرحلة',
      subtitle: 'حالة وأوقات أحداث الرحلة المسجلة',
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student & Trip Header Card
            Container(
              padding: const EdgeInsets.all(14.0),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: AppColors.primarySoft,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.directions_bus_rounded,
                      color: AppColors.primaryNavy,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'الطالب: ${student.name}',
                          style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${trip.tripType} • حافلة رقم ${trip.busNumber}',
                          style: AppTypography.caption,
                        ),
                      ],
                    ),
                  ),
                  StatusBadge(
                    label: trip.status.label,
                    colorType: trip.status.colorType,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Bus & Crew Information Card
            Container(
              padding: const EdgeInsets.all(14.0),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'بيانات الحافلة والطاقم',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  InformationRow(
                    label: 'اسم المسار',
                    value: trip.routeName,
                    icon: Icons.route_outlined,
                  ),
                  InformationRow(
                    label: 'السائق المسؤول',
                    value: trip.driverName,
                    icon: Icons.person_outline_rounded,
                  ),
                  InformationRow(
                    label: 'المشرفة',
                    value: trip.supervisorName,
                    icon: Icons.assignment_ind_outlined,
                  ),
                  InformationRow(
                    label: 'نقطة الانطلاق / الصعود',
                    value: student.pickupPoint,
                    icon: Icons.my_location_rounded,
                  ),
                  InformationRow(
                    label: 'نقطة الوصول',
                    value: student.dropoffPoint,
                    icon: Icons.location_on_outlined,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Timeline of Events
            Text(
              'سجل الأحداث الزمني',
              style: AppTypography.titleLarge.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                children: [
                  _TimelineTile(
                    time: '07:05 ص',
                    title: 'بدأت الرحلة',
                    subtitle: 'انطلقت الحافلة من نقطة البداية',
                    isCompleted: true,
                  ),
                  _TimelineTile(
                    time: '07:18 ص',
                    title: 'صعد إلى الباص',
                    subtitle: 'تم تسجيل صعود الطالب ${student.name} بنجاح',
                    isCompleted: true,
                  ),
                  _TimelineTile(
                    time: '07:45 ص (متوقع)',
                    title: 'وصل إلى المدرسة',
                    subtitle: 'تسجيل وصول الحافلة ودخول الطلاب للمدرسة',
                    isCompleted: false,
                    isLast: true,
                  ),
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

class _TimelineTile extends StatelessWidget {
  final String time;
  final String title;
  final String subtitle;
  final bool isCompleted;
  final bool isLast;

  const _TimelineTile({
    required this.time,
    required this.title,
    required this.subtitle,
    required this.isCompleted,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            time,
            style: AppTypography.caption.copyWith(
              fontWeight: FontWeight.w600,
              color: isCompleted ? AppColors.primaryNavy : AppColors.mutedText,
            ),
          ),
        ),
        Column(
          children: [
            Container(
              width: 14,
              height: 14,
              decoration: BoxDecoration(
                color: isCompleted ? AppColors.primaryNavy : AppColors.surface,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isCompleted ? AppColors.primaryNavy : AppColors.border,
                  width: 2,
                ),
              ),
              child: isCompleted
                  ? const Icon(Icons.check, size: 8, color: Colors.white)
                  : null,
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 36,
                color: isCompleted ? AppColors.primaryNavy : AppColors.border,
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.titleSmall.copyWith(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: AppTypography.caption,
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/information_row.dart';
import '../../core/widgets/status_badge.dart';
import '../../core/widgets/student_widgets.dart';
import '../../mock/mock_repository.dart';

class StudentDetailsScreen extends ConsumerWidget {
  const StudentDetailsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final student = students.isNotEmpty
        ? students[selectedIndex]
        : MockData.students.first;

    return AppScaffold(
      title: 'بيانات الطالب والاشتراك',
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Student Profile Card
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                children: [
                  StudentAvatar(name: student.name, size: 64),
                  const SizedBox(height: 10),
                  Text(
                    student.name,
                    style: AppTypography.headlineLarge.copyWith(fontSize: 18, color: AppColors.primaryNavy),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${student.grade} • ${student.section}',
                    style: AppTypography.caption,
                  ),
                  const SizedBox(height: 8),
                  StatusBadge(
                    label: 'اشتراك النقل: ${student.subscriptionStatus}',
                    colorType: 'green',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Financial Summary Card (Section 14)
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
                  Text(
                    'الملخص المالي والرسوم',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _FinancialMetric(
                        label: 'المطلوب',
                        amount: '3,000 ر.س',
                        color: AppColors.mainText,
                      ),
                      Container(width: 1, height: 32, color: AppColors.divider),
                      _FinancialMetric(
                        label: 'المدفوع',
                        amount: '3,000 ر.س',
                        color: AppColors.successGreen,
                      ),
                      Container(width: 1, height: 32, color: AppColors.divider),
                      _FinancialMetric(
                        label: 'المتبقي',
                        amount: '0 ر.س',
                        color: AppColors.primaryNavy,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: AppRadius.borderMd,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.receipt_long_outlined, size: 16, color: AppColors.primaryNavy),
                            const SizedBox(width: 6),
                            Text(
                              'سند سداد #REC-2026-08',
                              style: AppTypography.caption.copyWith(fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        Text(
                          '2026-01-15 • مكرر',
                          style: AppTypography.caption.copyWith(color: AppColors.mutedText, fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Detailed School & Bus Specs
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
                  Text(
                    'معلومات النقل والمدرسة',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  InformationRow(
                    label: 'المدرسة',
                    value: student.schoolName,
                    icon: Icons.school_outlined,
                  ),
                  InformationRow(
                    label: 'رقم الحافلة',
                    value: student.busNumber,
                    icon: Icons.directions_bus_outlined,
                  ),
                  InformationRow(
                    label: 'المسار المعتمد',
                    value: student.routeName,
                    icon: Icons.alt_route_rounded,
                  ),
                  InformationRow(
                    label: 'نقطة الصعود',
                    value: student.pickupPoint,
                    icon: Icons.my_location_rounded,
                  ),
                  InformationRow(
                    label: 'نقطة النزول',
                    value: student.dropoffPoint,
                    icon: Icons.location_on_outlined,
                  ),
                  InformationRow(
                    label: 'ولي الأمر المسجل',
                    value: student.parentName,
                    icon: Icons.person_outline_rounded,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            SecondaryButton(
              text: 'عرض سجل رحلات الطالب',
              icon: Icons.history_rounded,
              onPressed: () => context.push('/parent/trip-history'),
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

class _FinancialMetric extends StatelessWidget {
  final String label;
  final String amount;
  final Color color;

  const _FinancialMetric({
    required this.label,
    required this.amount,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: AppTypography.caption,
        ),
        const SizedBox(height: 2),
        Text(
          amount,
          style: AppTypography.titleSmall.copyWith(
            color: color,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

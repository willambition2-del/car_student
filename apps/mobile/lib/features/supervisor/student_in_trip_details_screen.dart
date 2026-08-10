import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/information_row.dart';
import '../../core/widgets/status_badge.dart';
import '../../core/widgets/student_widgets.dart';
import '../../mock/mock_repository.dart';

class StudentInTripDetailsScreen extends ConsumerWidget {
  const StudentInTripDetailsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final student = students.length > selectedIndex
        ? students[selectedIndex]
        : students.first;

    return AppScaffold(
      title: 'تفاصيل الطالب في الرحلة',
      subtitle: 'المحطة والتواصل الطارئ مع ولي الأمر',
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
              child: Column(
                children: [
                  StudentAvatar(name: student.name, size: 64),
                  const SizedBox(height: 10),
                  Text(student.name, style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 2),
                  Text(
                    '${student.grade} • ${student.section}',
                    style: AppTypography.caption,
                  ),
                  const SizedBox(height: 8),
                  StatusBadge(
                    label: student.currentStatus.label,
                    colorType: student.currentStatus.colorType,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

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
                    'محطة الصعود والنزول والتواصل',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
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
                    label: 'اسم ولي الأمر',
                    value: student.parentName,
                    icon: Icons.person_outline_rounded,
                  ),
                  InformationRow(
                    label: 'رقم الهاتف المباشر',
                    value: student.parentPhone,
                    icon: Icons.phone_outlined,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.primaryBorder, width: 1),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.info_outline_rounded,
                    color: AppColors.primaryNavy,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ملاحظات خاصة بالمشرفة',
                          style: AppTypography.titleSmall.copyWith(
                            color: AppColors.primaryNavy,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          'الطالب يتواجد بالمحطة رقم 3 برفقة أحد الوالدين.',
                          style: AppTypography.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            PrimaryButton(
              text: 'اتصال مباشر بولي الأمر (${student.parentPhone})',
              icon: Icons.phone_forwarded_rounded,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'جاري إجراء اتصال مباشر برقم ولي الأمر: ${student.parentPhone}',
                    ),
                  ),
                );
              },
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

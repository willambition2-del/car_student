import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';

class SchoolArrivalScreen extends ConsumerStatefulWidget {
  const SchoolArrivalScreen({super.key});

  @override
  ConsumerState<SchoolArrivalScreen> createState() =>
      _SchoolArrivalScreenState();
}

class _SchoolArrivalScreenState extends ConsumerState<SchoolArrivalScreen> {
  bool _isLoading = false;

  void _confirmArrivalAll() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 600));

    final currentStudents = ref.read(studentsListProvider).value;
    if (currentStudents != null) {
      // In a real app we'd call the API here then refresh the provider.
    }

    if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('تم تسجيل وصول جميع الطلاب للمدرسة بنجاح!'),
        ),
      );
      context.push('/supervisor/end-trip');
    }
  }

  @override
  Widget build(BuildContext context) {
    final studentsState = ref.watch(studentsListProvider);

    return studentsState.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("خطأ: $error"))),
      data: (students) {
        final insideBusStudents = students
            .where((s) => s.currentStatus == StudentTripStatus.boarded)
            .toList();

        return AppScaffold(
          title: 'تسجيل الوصول للمدرسة',
          subtitle: 'تأكيد نزول جميع الطلاب ودخولهم المدرسة',
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14.0),
                decoration: BoxDecoration(
                  color: AppColors.primarySoft,
                  borderRadius: AppRadius.borderLg,
                  border: Border.all(color: AppColors.primaryBorder, width: 1),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.school_outlined,
                      color: AppColors.primaryNavy,
                      size: 26,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'وصلت الحافلة إلى بوابة المدرسة',
                            style: AppTypography.titleSmall.copyWith(
                              color: AppColors.primaryNavy,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            'عدد الطلاب داخل الباص حاليًا: ${insideBusStudents.length} طالب',
                            style: AppTypography.caption,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Text(
                'قائمة الطلاب جاهزي النزول (${insideBusStudents.length})',
                style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              Expanded(
                child: ListView.builder(
                  itemCount: insideBusStudents.length,
                  itemBuilder: (context, index) {
                    final student = insideBusStudents[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: AppRadius.borderLg,
                        border: Border.all(color: AppColors.border, width: 1),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.check_circle_outline_rounded,
                            color: AppColors.successGreen,
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              student.name,
                              style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                          ),
                          Text(
                            student.grade,
                            style: AppTypography.caption,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 14),

              PrimaryButton(
                text: 'تسجيل وصول ونزول الجميع (${insideBusStudents.length} طالب)',
                isLoading: _isLoading,
                onPressed: _confirmArrivalAll,
              ),
            ],
          ),
        );
      },
    );
  }
}

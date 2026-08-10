import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';

class SupervisorEndTripScreen extends ConsumerStatefulWidget {
  const SupervisorEndTripScreen({super.key});

  @override
  ConsumerState<SupervisorEndTripScreen> createState() =>
      _SupervisorEndTripScreenState();
}

class _SupervisorEndTripScreenState
    extends ConsumerState<SupervisorEndTripScreen> {
  final _notesController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

    void _finishTrip() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 600));

    if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تم إنهاء الرحلة وإرسال التقرير بنجاح!')),
      );
      context.go('/supervisor/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final insideBusCount = students
        .where((s) => s.currentStatus == StudentTripStatus.boarded)
        .length;
    final arrivedCount = students
        .where((s) => s.currentStatus == StudentTripStatus.arrived || s.currentStatus == StudentTripStatus.droppedOff)
        .length;
    final absentCount = students
        .where(
          (s) =>
              s.currentStatus == StudentTripStatus.absent ||
              s.currentStatus == StudentTripStatus.notPresent,
        )
        .length;

    final hasStuckStudent = insideBusCount > 0;

    return AppScaffold(
      title: 'إغلاق الرحلة وتوثيق التقرير',
      subtitle: 'الملخص النهائي وملاحظات المشرفة الميدانية',
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (hasStuckStudent) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.errorRed.withValues(alpha: 0.1),
                  borderRadius: AppRadius.borderLg,
                  border: Border.all(color: AppColors.errorRed, width: 1),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.warning_amber_rounded,
                      color: AppColors.errorRed,
                      size: 24,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'تنبيه أمني: يوجد $insideBusCount طالب داخل الحافلة! يجب تفريغ الجميع قبل إغلاق الرحلة.',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.errorRed,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
            ],

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
                    'الملخص النهائي للرحلة',
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _SummaryItem(
                        label: 'إجمالي الطلاب',
                        value: '${students.length}',
                        color: AppColors.mainText,
                      ),
                      Container(width: 1, height: 28, color: AppColors.divider),
                      _SummaryItem(
                        label: 'تم التسليم/الوصول',
                        value: '$arrivedCount',
                        color: AppColors.successGreen,
                      ),
                      Container(width: 1, height: 28, color: AppColors.divider),
                      _SummaryItem(
                        label: 'غائبون',
                        value: '$absentCount',
                        color: AppColors.warningAmber,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            AppTextField(
              label: 'ملاحظات المشرفة (إن وجدت)',
              hintText: 'مثال: حركة مرور مزدحمة، ملاحظات انضباط...',
              controller: _notesController,
              maxLines: 3,
            ),
            const SizedBox(height: 24),

            PrimaryButton(
              text: 'تأكيد وإغلاق الرحلة رسمياً',
              isLoading: _isLoading,
              onPressed: hasStuckStudent ? null : _finishTrip,
            ),
          ],
        ),
      ),
    );
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _SummaryItem({
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

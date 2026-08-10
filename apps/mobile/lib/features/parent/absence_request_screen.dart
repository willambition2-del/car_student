import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/date_selector.dart';
import '../../mock/mock_repository.dart';

class AbsenceRequestScreen extends ConsumerStatefulWidget {
  const AbsenceRequestScreen({super.key});

  @override
  ConsumerState<AbsenceRequestScreen> createState() =>
      _AbsenceRequestScreenState();
}

class _AbsenceRequestScreenState extends ConsumerState<AbsenceRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _reasonController = TextEditingController();
  String _selectedTripType = 'يوم كامل';
  String _startDate = '2026-08-10';
  bool _willSelfPickup = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(milliseconds: 600));

      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('تم إرسال طلب الغياب بنجاح وإشعارات الطاقم المسؤول'),
          ),
        );
        context.push('/parent/absence-history');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final student = students.isNotEmpty
        ? students[selectedIndex]
        : MockData.students.first;

    return AppScaffold(
      title: 'طلب غياب طالب',
      subtitle: 'إبلاغ المدرسة والمشرفة قبل انطلاق الرحلة',
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: AppRadius.borderLg,
            border: Border.all(color: AppColors.border, width: 1),
          ),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.person_outline_rounded, color: AppColors.primaryNavy, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'الطالب: ${student.name} (${student.grade} - ${student.section})',
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12.0),
                  child: Divider(height: 1, color: AppColors.divider),
                ),

                Text('نطاق الغياب المطلوبة', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: ['رحلة الصباح', 'رحلة العودة', 'يوم كامل', 'عدة أيام']
                      .map((type) {
                        final isSelected = type == _selectedTripType;
                        return ChoiceChip(
                          label: Text(type),
                          selected: isSelected,
                          selectedColor: AppColors.primaryNavy,
                          backgroundColor: AppColors.surface,
                          side: BorderSide(
                            color: isSelected ? AppColors.primaryNavy : AppColors.border,
                          ),
                          labelStyle: AppTypography.caption.copyWith(
                            color: isSelected ? Colors.white : AppColors.mainText,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          ),
                          onSelected: (val) {
                            if (val) setState(() => _selectedTripType = type);
                          },
                        );
                      })
                      .toList(),
                ),
                const SizedBox(height: 16),

                DateSelector(
                  label: 'تاريخ الغياب',
                  selectedDate: _startDate,
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime.now(),
                      lastDate: DateTime(2027),
                    );
                    if (picked != null) {
                      setState(
                        () => _startDate =
                            "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}",
                      );
                    }
                  },
                ),
                const SizedBox(height: 14),

                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    'استلام شخصي من المدرسة',
                    style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                  ),
                  subtitle: Text(
                    'تنبيه السائق والمشرفة بأن الطالب لن يستقل باص العودة',
                    style: AppTypography.caption,
                  ),
                  value: _willSelfPickup,
                  activeTrackColor: AppColors.primaryNavy,
                  onChanged: (val) => setState(() => _willSelfPickup = val),
                ),
                const SizedBox(height: 14),

                AppTextField(
                  label: 'سبب الغياب (اختياري)',
                  hintText: 'مراجعة طبية، ظروف عائلية...',
                  controller: _reasonController,
                  maxLines: 2,
                ),
                const SizedBox(height: 24),

                PrimaryButton(
                  text: 'إرسال طلب الغياب',
                  isLoading: _isLoading,
                  onPressed: _handleSubmit,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

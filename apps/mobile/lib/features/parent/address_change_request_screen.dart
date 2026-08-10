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
import '../../mock/models/models.dart';

class AddressChangeRequestScreen extends ConsumerStatefulWidget {
  const AddressChangeRequestScreen({super.key});

  @override
  ConsumerState<AddressChangeRequestScreen> createState() =>
      _AddressChangeRequestScreenState();
}

class _AddressChangeRequestScreenState
    extends ConsumerState<AddressChangeRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _newAddressController = TextEditingController(
    text: 'حي النور - شارع الخليج - فيلا 45',
  );
  final _reasonController = TextEditingController();
  final _landmarkController = TextEditingController();
  AddressRequestType _selectedType = AddressRequestType.permanent;
  String _startDate = '2026-08-10';
  String _endDate = '2026-08-20';
  bool _isLoading = false;

  @override
  void dispose() {
    _newAddressController.dispose();
    _reasonController.dispose();
    _landmarkController.dispose();
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
            content: Text('تم إرسال طلب تغيير العنوان بنجاح لإدارة النقل المدرسي'),
          ),
        );
        context.push('/parent/address-requests-list');
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
      title: 'طلب تغيير عنوان السكن',
      subtitle: 'تقديم طلب نقل محطة الصعود أو النزول إلى موقع جديد',
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
                        'الطالب: ${student.name} • العنوان الحالي: ${student.pickupPoint}',
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 10.0),
                  child: Divider(height: 1, color: AppColors.divider),
                ),

                // Location Picker Trigger
                InkWell(
                  onTap: () async {
                    final res = await context.push<String>(
                      '/parent/map-location-picker',
                    );
                    if (res != null) {
                      setState(() => _newAddressController.text = res);
                    }
                  },
                  borderRadius: AppRadius.borderLg,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: AppRadius.borderLg,
                      border: Border.all(color: AppColors.primaryBorder, width: 1),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.pin_drop_rounded,
                          color: AppColors.primaryNavy,
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _newAddressController.text,
                                style: AppTypography.titleSmall.copyWith(
                                  color: AppColors.primaryNavy,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'انقر لتحديد وتغيير الموقع على الخريطة',
                                style: AppTypography.caption,
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_left_rounded, color: AppColors.primaryNavy, size: 20),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                Text('نوع التغيير المطلوب', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  children: AddressRequestType.values.map((type) {
                    final isSelected = type == _selectedType;
                    return ChoiceChip(
                      label: Text(type.label),
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
                        if (val) setState(() => _selectedType = type);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),

                Row(
                  children: [
                    Expanded(
                      child: DateSelector(
                        label: 'تاريخ البداية',
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
                    ),
                    if (_selectedType == AddressRequestType.temporary) ...[
                      const SizedBox(width: 10),
                      Expanded(
                        child: DateSelector(
                          label: 'تاريخ النهاية',
                          selectedDate: _endDate,
                          onTap: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: DateTime.now().add(
                                const Duration(days: 7),
                              ),
                              firstDate: DateTime.now(),
                              lastDate: DateTime(2027),
                            );
                            if (picked != null) {
                              setState(
                                () => _endDate =
                                    "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}",
                              );
                            }
                          },
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 14),

                AppTextField(
                  label: 'سبب التغيير',
                  hintText: 'الانتقال لمسكن جديد، ظروف مؤقتة...',
                  controller: _reasonController,
                  maxLines: 2,
                  validator: (val) => val == null || val.isEmpty ? 'يرجى كتابة سبب التغيير' : null,
                ),
                const SizedBox(height: 14),

                AppTextField(
                  label: 'أقرب معلم أو وصف المنزل',
                  hintText: 'مقابل مسجد التقوى / فيلا رقم 45',
                  controller: _landmarkController,
                ),
                const SizedBox(height: 24),

                PrimaryButton(
                  text: 'إرسال طلب تغيير العنوان',
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

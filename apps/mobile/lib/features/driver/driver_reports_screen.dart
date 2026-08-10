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

class DriverReportsScreen extends ConsumerStatefulWidget {
  const DriverReportsScreen({super.key});

  @override
  ConsumerState<DriverReportsScreen> createState() =>
      _DriverReportsScreenState();
}

class _DriverReportsScreenState extends ConsumerState<DriverReportsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descController = TextEditingController();
  String _selectedIncidentType = 'تأخير بسبب الازدحام المروري';
  bool _isLoading = false;

  final List<String> _types = [
    'عطل ميكانيكي بالحافلة',
    'حادث سير لا سمح الله',
    'تأخير بسبب الازدحام المروري',
    'حالة صحية طارئة',
    'مشكلة أمنية في الطريق',
    'بلاغ آخر',
  ];

  @override
  void dispose() {
    _descController.dispose();
    super.dispose();
  }

  void _submitIncident() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(milliseconds: 600));

      final incident = DriverIncidentModel(
        id: 'inc_${DateTime.now().millisecondsSinceEpoch}',
        type: _selectedIncidentType,
        description: _descController.text,
        timestamp: 'الآن',
        status: 'تم الإبلاغ',
      );

      final current = ref.read(driverIncidentsProvider);
      // ref.read(driverIncidentsProvider.notifier).state = [incident, ...current];

      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'تم إرسال البلاغ بنجاح إلى مركز التحكم وإدارة المدرسة',
            ),
          ),
        );
        context.pop();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'إرسال بلاغ طارئ',
      subtitle: 'تنبيه مباشر لغرفة عمليات وإدارة المدرسة',
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
                Text('نوع البلاغ الطارئ', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: _types.map((t) {
                    final isSelected = t == _selectedIncidentType;
                    return ChoiceChip(
                      label: Text(t),
                      selected: isSelected,
                      selectedColor: AppColors.errorRed,
                      backgroundColor: AppColors.surface,
                      side: BorderSide(
                        color: isSelected ? AppColors.errorRed : AppColors.border,
                      ),
                      labelStyle: AppTypography.caption.copyWith(
                        color: isSelected ? Colors.white : AppColors.mainText,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _selectedIncidentType = t);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),

                AppTextField(
                  label: 'تفاصيل ووصف البلاغ',
                  hintText: 'وصف العطل أو الموقع الدقيق...',
                  controller: _descController,
                  maxLines: 3,
                  validator: (val) => val == null || val.isEmpty ? 'يرجى كتابة تفاصيل البلاغ' : null,
                ),
                const SizedBox(height: 14),

                InkWell(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('تم توثيق التقاط الصورة بنجاح (معاينة)'),
                      ),
                    );
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
                          Icons.camera_alt_outlined,
                          color: AppColors.primaryNavy,
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'إرفاق صورة توثيقية من الكاميرا (اختياري)',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.primaryNavy,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                DangerButton(
                  text: 'إرسال البلاغ الطارئ فورًا',
                  icon: Icons.send_rounded,
                  isLoading: _isLoading,
                  onPressed: _submitIncident,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

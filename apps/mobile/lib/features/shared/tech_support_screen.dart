import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class TechSupportScreen extends ConsumerStatefulWidget {
  const TechSupportScreen({super.key});

  @override
  ConsumerState<TechSupportScreen> createState() => _TechSupportScreenState();
}

class _TechSupportScreenState extends ConsumerState<TechSupportScreen> {
  final _formKey = GlobalKey<FormState>();
  final _subjectController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCategory = 'استفسارات النقل';
  bool _isLoading = false;

  @override
  void dispose() {
    _subjectController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _submitTicket() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(milliseconds: 600));

      if (mounted) {
        setState(() => _isLoading = false);
        _subjectController.clear();
        _descController.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'تم إنشاء تذكرة الدعم الفني بنجاح! سيتم التواصل معكم قريبًا.',
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(supportTicketsProvider).when(
      data: (tickets) {
        
    

    return AppScaffold(
      title: 'الدعم الفني والتذاكر',
      subtitle: 'تقديم البلاغات والاستفسارات التقنية',
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16.0),
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
                    Text(
                      'إنشاء تذكرة دعم جديدة',
                      style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: _selectedCategory,
                      decoration: const InputDecoration(
                        labelText: 'فئة البلاغ',
                      ),
                      items: [
                        'استفسارات النقل',
                        'مشكلة في التطبيق',
                        'تعديل بيانات',
                        'شكوى طارئة',
                      ]
                          .map(
                            (c) => DropdownMenuItem(
                              value: c,
                              child: Text(c, style: AppTypography.bodySmall),
                            ),
                          )
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedCategory = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    AppTextField(
                      label: 'موضوع التذكرة',
                      hintText: 'عنوان مختصر للمشكلة',
                      controller: _subjectController,
                      validator: (val) => val == null || val.isEmpty ? 'يرجى كتابة الموضوع' : null,
                    ),
                    const SizedBox(height: 12),
                    AppTextField(
                      label: 'وصف التفاصيل',
                      hintText: 'شرح مفصل للاستفسار أو المشكلة...',
                      controller: _descController,
                      maxLines: 3,
                      validator: (val) => val == null || val.isEmpty ? 'يرجى كتابة التفاصيل' : null,
                    ),
                    const SizedBox(height: 18),
                    PrimaryButton(
                      text: 'إرسال التذكرة للدعم',
                      isLoading: _isLoading,
                      onPressed: _submitTicket,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 18),

            Text(
              'سجل التذاكر السابقة (${tickets.length})',
              style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 10),

            ...tickets.map(
              (tkt) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14.0),
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
                        Text(
                          'تذكرة #${tkt.id} • ${tkt.subject}',
                          style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w600),
                        ),
                        StatusBadge(
                          label: tkt.status,
                          colorType: tkt.status == 'محلولة' ? 'green' : 'orange',
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'الفئة: ${tkt.category} • التاريخ: ${tkt.createdAt}',
                      style: AppTypography.caption,
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 6.0),
                      child: Divider(height: 1, color: AppColors.divider),
                    ),
                    Text(
                      tkt.description,
                      style: AppTypography.bodySmall.copyWith(color: AppColors.secondaryText),
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
    );}
}

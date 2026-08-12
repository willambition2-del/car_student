import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/information_row.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';
import '../../features/transport_manager/services/requests_service.dart';

class TransportAddressReviewScreen extends ConsumerStatefulWidget {
  const TransportAddressReviewScreen({super.key});

  @override
  ConsumerState<TransportAddressReviewScreen> createState() =>
      _TransportAddressReviewScreenState();
}

class _TransportAddressReviewScreenState
    extends ConsumerState<TransportAddressReviewScreen> {
  final _notesController = TextEditingController(
    text:
        'تمت مراجعة خط السير وتأكيد إمكانية تغطية العنوان الجديد بالحافلة رقم 205.',
  );
  String _assignedBus = 'حافلة 205 - مسار حي الهدى';
  bool _isLoading = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _handleApprove(String id) async {
    setState(() => _isLoading = true);
    try {
      await ref.read(requestsServiceProvider).resolveAddressRequest(
        id, 
        true, 
        notes: _notesController.text
      );
      ref.invalidate(addressRequestsProvider);
      
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'تم قبول طلب تغيير العنوان وتحديث خط سير الحافلة بنجاح!',
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('فشل الموافقة على الطلب: $e'),
            backgroundColor: AppColors.errorRed,
          ),
        );
      }
    }
  }

  void _handleReject(String id) async {
    setState(() => _isLoading = true);
    try {
      await ref.read(requestsServiceProvider).resolveAddressRequest(
        id, 
        false, 
        notes: _notesController.text
      );
      ref.invalidate(addressRequestsProvider);
      
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'تم رفض طلب العنوان وإبلاع ولي الأمر',
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('فشل رفض الطلب: $e'),
            backgroundColor: AppColors.errorRed,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(addressRequestsProvider).when(
      data: (requests) {
        
    
    final req = requests.first;

    return AppScaffold(
      title: 'مراجعة وتخصيص طلب العنوان',
      subtitle: 'دراسة نطاق التغطية وتعيين الحافلة والمسار',
      body: SingleChildScrollView(
        child: Container(
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
                  Text(
                    'طلب تغيير عنوان: ${req.studentName}',
                    style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const StatusBadge(
                    label: 'قيد المراجعة الفنية',
                    colorType: 'orange',
                  ),
                ],
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8.0),
                child: Divider(height: 1, color: AppColors.divider),
              ),
              InformationRow(
                label: 'العنوان السابق',
                value: req.currentAddress,
              ),
              InformationRow(
                label: 'العنوان الجديد المطلوب',
                value: req.newAddress,
                valueColor: AppColors.primaryNavy,
              ),
              InformationRow(
                label: 'المسافة الإضافية',
                value: '+ 2.4 كم (ضمن التغطية)',
              ),
              InformationRow(
                label: 'السبب المرفوع',
                value: req.reason,
              ),
              InformationRow(
                label: 'تاريخ التطبيق',
                value: req.startDate,
              ),
              const SizedBox(height: 14),

              Text(
                'تخصيص الحافلة والمسار المناسب',
                style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppRadius.borderLg,
                  border: Border.all(color: AppColors.border, width: 1),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _assignedBus,
                    isExpanded: true,
                    items: [
                      'حافلة 205 - مسار حي الهدى',
                      'حافلة 102 - مسار حي الروضة',
                      'حافلة 304 - مسار حي النور',
                    ]
                        .map(
                          (b) => DropdownMenuItem(
                            value: b,
                            child: Text(b, style: AppTypography.bodySmall),
                          ),
                        )
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _assignedBus = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 14),

              AppTextField(
                label: 'ملاحظات وتوجيهات إدارة النقل',
                hintText: 'الملاحظات للمدرسة وولي الأمر...',
                controller: _notesController,
                maxLines: 2,
              ),
              const SizedBox(height: 20),

              Row(
                children: [
                  Expanded(
                    child: DangerButton(
                      text: 'رفض الطلب',
                      height: 44,
                      onPressed: () => _handleReject(req.id),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: PrimaryButton(
                      text: 'موافقة وتحديث المسار',
                      height: 44,
                      isLoading: _isLoading,
                      onPressed: () => _handleApprove(req.id),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

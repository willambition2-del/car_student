import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/information_row.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class SyncOperationDetailsScreen extends ConsumerWidget {
  const SyncOperationDetailsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(syncOperationsProvider).when(
      data: (ops) {
        
    
    final op = ops.first;

    return AppScaffold(
      title: 'تفاصيل عملية المزامنة',
      subtitle: 'معلومات العملية المحفوظة محلياً والرد السيرفر',
      body: SingleChildScrollView(
        child: Column(
          children: [
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'معرف العملية #${op.id}',
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                      ),
                      StatusBadge(
                        label: op.status,
                        colorType: op.status == 'تمت المزامنة'
                            ? 'green'
                            : 'orange',
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  InformationRow(label: 'اسم الطالب', value: op.studentName),
                  InformationRow(label: 'رقم الرحلة', value: op.tripId),
                  InformationRow(label: 'نوع الإجراء', value: op.actionType),
                  InformationRow(
                    label: 'الحالة السابقة',
                    value: op.previousState,
                  ),
                  InformationRow(label: 'الحالة الجديدة', value: op.newState),
                  InformationRow(
                    label: 'التوقيت المحلي',
                    value: op.timestamp,
                  ),
                  InformationRow(
                    label: 'إحداثيات GPS',
                    value: '24.7136° N, 46.6753° E',
                  ),
                  InformationRow(
                    label: 'عدد المحاولات',
                    value: '${op.retryCount}',
                  ),
                  if (op.failureReason != null)
                    InformationRow(
                      label: 'سبب التعثر',
                      value: op.failureReason!,
                      valueColor: AppColors.errorRed,
                    ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            PrimaryButton(
              text: 'إعادة المحاولة والمزامنة الآن',
              icon: Icons.refresh_rounded,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('تمت إعادة إرسال العملية بنجاح!'),
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

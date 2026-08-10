import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/information_row.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class AddressRequestDetailsScreen extends ConsumerWidget {
  const AddressRequestDetailsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(addressRequestsProvider).when(
      data: (requests) {
        
    
    final request = requests.first;

    return AppScaffold(
      title: 'تفاصيل طلب العنوان',
      subtitle: 'حالة الطلب ومقارنة الموقع الحالي بالجديد',
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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
                        'طلب رقم #${request.id}',
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700),
                      ),
                      StatusBadge(
                        label: request.status.label,
                        colorType: 'orange',
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  InformationRow(label: 'الطالب', value: request.studentName),
                  InformationRow(
                    label: 'نوع الطلب',
                    value: request.type.label,
                  ),
                  InformationRow(
                    label: 'تاريخ التطبيق',
                    value: request.startDate,
                  ),
                  InformationRow(label: 'سبب النقل', value: request.reason),
                  InformationRow(
                    label: 'أقرب معلم',
                    value: request.nearestLandmark,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Location Comparison Card
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
                  Text('مقارنة العناوين والمواقع', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_off_outlined,
                        color: AppColors.mutedText,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'العنوان السابق',
                              style: AppTypography.caption,
                            ),
                            Text(
                              request.currentAddress,
                              style: AppTypography.bodySmall.copyWith(color: AppColors.mainText),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.only(right: 6.0, top: 6, bottom: 6),
                    child: Icon(
                      Icons.arrow_downward_rounded,
                      color: AppColors.primaryNavy,
                      size: 18,
                    ),
                  ),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        color: AppColors.primaryNavy,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'العنوان الجديد المطلوب التحديد عليه',
                              style: AppTypography.caption,
                            ),
                            Text(
                              request.newAddress,
                              style: AppTypography.bodySmall.copyWith(
                                fontWeight: FontWeight.w700,
                                color: AppColors.primaryNavy,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // School Notes Card
            Container(
              padding: const EdgeInsets.all(14.0),
              decoration: BoxDecoration(
                color: AppColors.primarySoft,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.primaryBorder, width: 1),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.school_outlined,
                        color: AppColors.primaryNavy,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'ملاحظات إدارة النقل المدرسي',
                        style: AppTypography.titleSmall.copyWith(
                          color: AppColors.primaryNavy,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    request.schoolNotes,
                    style: AppTypography.bodySmall.copyWith(color: AppColors.mainText),
                  ),
                ],
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

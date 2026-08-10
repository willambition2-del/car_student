import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class AbsenceHistoryScreen extends ConsumerWidget {
  const AbsenceHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(absenceRequestsProvider).when(
      data: (requests) {
        
    

    return AppScaffold(
      title: 'سجل طلبات الغياب',
      subtitle: 'متابعة حالة طلبات غياب أطفالك المرسلة',
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        elevation: 1,
        icon: const Icon(Icons.add_rounded, size: 18),
        label: Text('تقديم طلب غياب', style: AppTypography.buttonMedium),
        onPressed: () => context.push('/parent/absence-request'),
      ),
      body: ListView.builder(
        itemCount: requests.length,
        itemBuilder: (context, index) {
          final req = requests[index];
          return Container(
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
                      req.studentName,
                      style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                    ),
                    StatusBadge(
                      label: req.status,
                      colorType: req.status == 'مقبول' ? 'green' : 'orange',
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'الرحلة المتأثرة: ${req.type} • التاريخ: ${req.startDate}',
                  style: AppTypography.caption.copyWith(color: AppColors.primaryNavy, fontWeight: FontWeight.w600),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8.0),
                  child: Divider(height: 1, color: AppColors.divider),
                ),
                Text(
                  'السبب: ${req.reason}',
                  style: AppTypography.bodySmall.copyWith(color: AppColors.secondaryText),
                ),
              ],
            ),
          );
        },
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

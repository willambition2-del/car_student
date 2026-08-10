import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/state_widgets.dart';
import '../../core/widgets/sync_operation_card.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';

class SyncLogListScreen extends ConsumerWidget {
  const SyncLogListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(syncOperationsProvider).when(
      data: (ops) {
        
    
    final pendingOpsCount = ops.where((s) => s.status != 'تمت المزامنة').length;

    return AppScaffold(
      title: 'سجل المزامنة الميدانية',
      subtitle: 'حالة مزامنة البيانات والعمليات بدون إنترنت',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/supervisor/sync',
      ),
      body: Column(
        children: [
          SyncStatusBanner(
            pendingCount: pendingOpsCount,
            onSyncPressed: () {
              final updated = ops
                  .map(
                    (o) => SyncOperationModel(
                      id: o.id,
                      studentName: o.studentName,
                      tripId: o.tripId,
                      actionType: o.actionType,
                      previousState: o.previousState,
                      newState: o.newState,
                      timestamp: o.timestamp,
                      status: 'تمت المزامنة',
                      retryCount: o.retryCount,
                    ),
                  )
                  .toList();

              // ref.read(syncOperationsProvider.notifier).state = updated;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('تمت مزامنة جميع العمليات بنجاح!'),
                ),
              );
            },
          ),
          const SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'العمليات المسجلة محلياً (${ops.length})',
                style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
              ),
              if (pendingOpsCount > 0)
                SecondaryButton(
                  text: 'مزامنة الكل الآن',
                  height: 36,
                  onPressed: () {
                    final updated = ops
                        .map(
                          (o) => SyncOperationModel(
                            id: o.id,
                            studentName: o.studentName,
                            tripId: o.tripId,
                            actionType: o.actionType,
                            previousState: o.previousState,
                            newState: o.newState,
                            timestamp: o.timestamp,
                            status: 'تمت المزامنة',
                            retryCount: o.retryCount,
                          ),
                        )
                        .toList();
                    // ref.read(syncOperationsProvider.notifier).state = updated;
                  },
                ),
            ],
          ),
          const SizedBox(height: 10),

          Expanded(
            child: ListView.builder(
              itemCount: ops.length,
              itemBuilder: (context, index) {
                final op = ops[index];
                return GestureDetector(
                  onTap: () => context.push('/supervisor/sync-details'),
                  child: SyncOperationCard(
                    operation: op,
                    onRetry: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('جاري إعادة إرسال العملية #${op.id}'),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

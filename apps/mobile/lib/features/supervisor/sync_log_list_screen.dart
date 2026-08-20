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
import '../../core/sync/sync_service.dart';

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
            onSyncPressed: () async {
              try {
                await ref.read(syncServiceProvider).processQueue();
                ref.invalidate(syncOperationsProvider);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تمت عملية المزامنة بنجاح!')),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('فشل أثناء المزامنة: $e')),
                  );
                }
              }
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
                  onPressed: () async {
                    try {
                      await ref.read(syncServiceProvider).processQueue();
                      ref.invalidate(syncOperationsProvider);
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('فشل المزامنة: $e')),
                        );
                      }
                    }
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

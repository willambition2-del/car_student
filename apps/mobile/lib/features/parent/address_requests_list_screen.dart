import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/address_card.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/state_widgets.dart';
import '../../mock/mock_repository.dart';

class AddressRequestsListScreen extends ConsumerStatefulWidget {
  const AddressRequestsListScreen({super.key});

  @override
  ConsumerState<AddressRequestsListScreen> createState() =>
      _AddressRequestsListScreenState();
}

class _AddressRequestsListScreenState
    extends ConsumerState<AddressRequestsListScreen> {
  String _selectedFilter = 'الكل';

  @override
  Widget build(BuildContext context) {
    return ref.watch(addressRequestsProvider).when(
      data: (requests) {
        
    

    final filtered = requests.where((req) {
      if (_selectedFilter == 'الكل') return true;
      if (_selectedFilter == 'قيد المراجعة') {
        return req.status.label == 'قيد المراجعة';
      }
      if (_selectedFilter == 'مقبول') return req.status.label == 'مقبول';
      if (_selectedFilter == 'مرفوض') return req.status.label == 'مرفوض';
      return true;
    }).toList();

    return AppScaffold(
      title: 'طلبات تغيير العنوان',
      subtitle: 'سجل طلبات نقل السكن ومحطات التجمع',
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryNavy,
        foregroundColor: Colors.white,
        elevation: 1,
        icon: const Icon(Icons.add_rounded, size: 18),
        label: Text('تقديم طلب جديد', style: AppTypography.buttonMedium),
        onPressed: () => context.push('/parent/address-change-request'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['الكل', 'قيد المراجعة', 'مقبول', 'مرفوض'].map((
                filter,
              ) {
                final isSelected = filter == _selectedFilter;
                return Padding(
                  padding: const EdgeInsets.only(left: 6.0),
                  child: ChoiceChip(
                    label: Text(filter),
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
                      if (val) setState(() => _selectedFilter = filter);
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: filtered.isEmpty
                ? const EmptyState(
                    title: 'لا توجد طلبات عنوان بهذه الفئة',
                    message:
                        'يمكنك تقديم طلب جديد في أي وقت لتحديث موقع السكن أو محطة التجمع.',
                    icon: Icons.location_off_outlined,
                  )
                : ListView.builder(
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final req = filtered[index];
                      return AddressCard(
                        request: req,
                        onTap: () =>
                            context.push('/parent/address-request-details'),
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

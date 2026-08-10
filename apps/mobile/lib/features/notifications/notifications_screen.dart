import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/notification_card.dart';
import '../../core/widgets/state_widgets.dart';
import '../../mock/mock_repository.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  String _selectedCategory = 'الكل';

  @override
  Widget build(BuildContext context) {
    return ref.watch(notificationsProvider).when(
      data: (notifications) {
        
    

    final filtered = notifications.where((n) {
      if (_selectedCategory == 'الكل') return true;
      return n.category == _selectedCategory;
    }).toList();

    return AppScaffold(
      title: 'الإشعارات والتنبيهات',
      subtitle: 'التحديثات الفورية لحالة الرحلات والطلبات',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/parent/notifications',
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['الكل', 'رحلات', 'عناوين', 'غياب', 'نظام'].map((cat) {
                final isSelected = cat == _selectedCategory;
                return Padding(
                  padding: const EdgeInsets.only(left: 6.0),
                  child: ChoiceChip(
                    label: Text(cat),
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
                      if (val) setState(() => _selectedCategory = cat);
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
                    title: 'لا توجد إشعارات حاليًا',
                    message:
                        'ستظهر هنا جميع التحديثات الفورية المتعلقة بركوب الطلاب ووصول الحافلات والطلبات.',
                    icon: Icons.notifications_off_outlined,
                  )
                : ListView.builder(
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      return NotificationCard(notification: filtered[index]);
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

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';
import '../storage/secure_storage_service.dart';

class RoleSwitcherCard extends ConsumerWidget {
  const RoleSwitcherCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!kDebugMode) return const SizedBox.shrink();

    final currentRole = ref.watch(selectedRoleProvider);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.primarySoft,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.primaryBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.developer_mode_rounded,
                color: AppColors.primaryNavy,
                size: 18,
              ),
              const SizedBox(width: 8),
              Text(
                'تبديل الدور للتجربة (وضع التطوير):',
                style: AppTypography.labelMedium.copyWith(
                  color: AppColors.primaryNavy,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: UserRole.values.map((role) {
                final isSelected = role == currentRole;
                return Padding(
                  padding: const EdgeInsets.only(left: 6.0),
                  child: ChoiceChip(
                    label: Text(role.label),
                    selected: isSelected,
                    selectedColor: AppColors.primaryNavy,
                    backgroundColor: Colors.white,
                    side: BorderSide(
                      color: isSelected ? AppColors.primaryNavy : AppColors.border,
                    ),
                    labelStyle: AppTypography.caption.copyWith(
                      color: isSelected ? Colors.white : AppColors.mainText,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    ),
                    onSelected: (val) async {
                      if (val) {
                        ref.read(selectedRoleProvider.notifier).state = role;
                        
                        String backendRole = 'PARENT';
                        String route = '/parent/home';
                        switch (role) {
                          case UserRole.parent:
                            backendRole = 'PARENT';
                            route = '/parent/home';
                            break;
                          case UserRole.supervisor:
                            backendRole = 'SUPERVISOR';
                            route = '/supervisor/home';
                            break;
                          case UserRole.driver:
                            backendRole = 'DRIVER';
                            route = '/driver/home';
                            break;
                          case UserRole.transportManager:
                            backendRole = 'TRANSPORT_MANAGER';
                            route = '/transport/home';
                            break;
                        }
                        
                        await SecureStorageService.saveAuthData(
                          accessToken: 'mock_demo_token',
                          refreshToken: 'mock_demo_refresh',
                          userId: 'demo_id',
                          userRole: backendRole,
                          email: 'demo@school.com',
                          fullName: 'مستخدم تجريبي',
                          mustChangePassword: false,
                        );

                        if (context.mounted) {
                          context.go(route);
                        }
                      }
                    },
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

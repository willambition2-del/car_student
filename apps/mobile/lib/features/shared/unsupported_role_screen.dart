import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../../core/storage/secure_storage_service.dart';
import '../../core/widgets/app_buttons.dart';

class UnsupportedRoleScreen extends StatelessWidget {
  const UnsupportedRoleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.block, size: 64, color: AppColors.errorRed),
              const SizedBox(height: 24),
              Text(
                'عذراً، هذا الدور غير مدعوم في تطبيق الهاتف.',
                style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'بعض الأدوار (مثل المشرف المالي أو مدير النظام) متاحة فقط عبر لوحة تحكم الويب.',
                style: AppTypography.bodyMedium.copyWith(color: AppColors.secondaryText),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: 200,
                child: PrimaryButton(
                  text: 'تسجيل الخروج',
                  onPressed: () async {
                    await SecureStorageService.clearAuthData();
                    if (context.mounted) {
                      context.go('/auth/login');
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

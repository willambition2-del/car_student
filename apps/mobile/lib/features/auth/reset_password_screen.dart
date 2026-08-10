import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _handleReset() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/auth/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'كلمة مرور جديدة',
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: AppRadius.borderLg,
              border: Border.all(color: AppColors.border, width: 1),
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Center(
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: AppColors.primarySoft,
                        borderRadius: AppRadius.borderLg,
                      ),
                      child: const Icon(
                        Icons.lock_outline_rounded,
                        size: 30,
                        color: AppColors.primaryNavy,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'تعيين كلمة المرور الجديدة',
                    style: AppTypography.titleLarge.copyWith(
                      color: AppColors.primaryNavy,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'أنشئ كلمة مرور جديدة تحتوي على 6 خانات على الأقل.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.secondaryText,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  PasswordField(
                    label: 'كلمة المرور الجديدة',
                    hintText: 'أدخل كلمة المرور الجديدة',
                    controller: _passwordController,
                    validator: (val) {
                      if (val == null || val.length < 6) {
                        return 'كلمة المرور يجب أن لا تقل عن 6 خانات';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  PasswordField(
                    label: 'تأكيد كلمة المرور الجديدة',
                    hintText: 'أعد إدخال كلمة المرور',
                    controller: _confirmController,
                    validator: (val) {
                      if (val != _passwordController.text) {
                        return 'كلمتا المرور غير متطابقتين';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  PrimaryButton(
                    text: 'حفظ كلمة المرور وتسجيل الدخول',
                    isLoading: _isLoading,
                    onPressed: _handleReset,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

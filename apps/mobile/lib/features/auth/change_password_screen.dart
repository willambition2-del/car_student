import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/app_buttons.dart';
import 'services/auth_service.dart';
import '../../core/storage/secure_storage_service.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleChangePassword() async {
    if (_formKey.currentState?.validate() ?? false) {
      if (_newPasswordController.text != _confirmPasswordController.text) {
        setState(() {
          _errorMessage = 'كلمتا المرور غير متطابقتين';
        });
        return;
      }

      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        await _authService.changePassword(
          _currentPasswordController.text,
          _newPasswordController.text,
        );

        if (!mounted) return;

        final role = await SecureStorageService.getUserRole();
        if (!mounted) return;

        if (role == 'PARENT') {
          context.go('/parent/home');
        } else if (role == 'SUPERVISOR') {
          context.go('/supervisor/home');

        } else if (role == 'SCHOOL_ADMIN' || role == 'TRANSPORT_MANAGER' || role == 'SCHOOL_OWNER') {
          context.go('/transport/home');
        } else {
          context.go('/auth/login');
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            _errorMessage = e.toString().replaceAll('Exception: ', '');
          });
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      showBackButton: false,
      title: 'تغيير كلمة المرور الإجباري',
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
                        color: AppColors.warningAmberSoft,
                        borderRadius: AppRadius.borderLg,
                        border: Border.all(color: AppColors.warningAmberBorder),
                      ),
                      child: const Icon(
                        Icons.shield_outlined,
                        size: 30,
                        color: AppColors.warningAmber,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'تحديث كلمة المرور المؤقتة',
                    style: AppTypography.titleLarge.copyWith(
                      color: AppColors.primaryNavy,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'يجب عليك تعيين كلمة مرور جديدة خاصة بك قبل المتابعة في النظام.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.secondaryText,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.errorRedSoft,
                        borderRadius: AppRadius.borderMd,
                        border: Border.all(color: AppColors.errorRedBorder),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline_rounded, size: 18, color: AppColors.errorRed),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.errorRed,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  PasswordField(
                    label: 'كلمة المرور الحالية',
                    controller: _currentPasswordController,
                    validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال كلمة المرور الحالية' : null,
                  ),
                  const SizedBox(height: 16),
                  PasswordField(
                    label: 'كلمة المرور الجديدة',
                    controller: _newPasswordController,
                    validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال كلمة المرور الجديدة' : null,
                  ),
                  const SizedBox(height: 16),
                  PasswordField(
                    label: 'تأكيد كلمة المرور الجديدة',
                    controller: _confirmPasswordController,
                    validator: (val) => val == null || val.isEmpty ? 'يرجى تأكيد كلمة المرور' : null,
                  ),
                  const SizedBox(height: 24),
                  PrimaryButton(
                    text: 'تغيير كلمة المرور والمتابعة',
                    isLoading: _isLoading,
                    onPressed: _handleChangePassword,
                  ),
                  const SizedBox(height: 12),
                  OutlineButton(
                    text: 'تسجيل الخروج',
                    onPressed: () async {
                      await _authService.logout();
                      if (context.mounted) context.go('/auth/login');
                    },
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

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  bool _isLoading = false;
  bool _isSuccess = false;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _handleSendCode() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isLoading = true);

      await Future.delayed(const Duration(milliseconds: 600));

      if (mounted) {
        setState(() {
          _isLoading = false;
          _isSuccess = true;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'استعادة كلمة المرور',
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
                        Icons.lock_reset_rounded,
                        size: 30,
                        color: AppColors.primaryNavy,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'استعادة الوصول للحساب',
                    style: AppTypography.titleLarge.copyWith(
                      color: AppColors.primaryNavy,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'أدخل البريد الإلكتروني أو رقم الهاتف المرتبط بحسابك لإرسال رمز التحقق.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.secondaryText,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),

                  if (_isSuccess) ...[
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.successGreenSoft,
                        borderRadius: AppRadius.borderMd,
                        border: Border.all(color: AppColors.successGreenBorder),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.check_circle_outline_rounded,
                            color: AppColors.successGreen,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'تم إرسال رمز التحقق بنجاح!',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.successGreen,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    PrimaryButton(
                      text: 'إدخال رمز التحقق (OTP)',
                      onPressed: () => context.push('/auth/otp'),
                    ),
                  ] else ...[
                    AppTextField(
                      label: 'البريد الإلكتروني / رقم الهاتف',
                      hintText: '05xxxxxxxx أو user@school.com',
                      controller: _phoneController,
                      keyboardType: TextInputType.emailAddress,
                      prefixIcon: Icons.contact_mail_outlined,
                      validator: (val) {
                        if (val == null || val.trim().isEmpty) {
                          return 'يرجى إدخال البيانات المطلوبة';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),
                    PrimaryButton(
                      text: 'إرسال رمز التحقق',
                      isLoading: _isLoading,
                      onPressed: _handleSendCode,
                    ),
                    const SizedBox(height: 10),
                    OutlineButton(
                      text: 'إلغاء والعودة',
                      onPressed: () => context.pop(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

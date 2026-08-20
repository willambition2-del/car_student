import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../mock/mock_repository.dart';
import 'services/auth_service.dart';
import '../../core/utils/role_route_mapper.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _rememberMe = true;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final data = await _authService.login(
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
        );

        if (!mounted) return;

        final userRole = data['user']?['role']?.toString();
        final mustChange = (data['user']?['mustChangePassword'] as bool?) ??
            (data['mustChangePassword'] as bool?) ??
            false;

        if (mustChange) {
          context.go('/auth/change-password');
          return;
        }

        final enumRole = RoleRouteMapper.getUserRoleEnum(userRole);
        final route = RoleRouteMapper.getRouteForRole(userRole);

        if (enumRole != null) {
          ref.read(selectedRoleProvider.notifier).state = enumRole;
        }

        context.go(route);
      } catch (e) {
        if (!mounted) return;
        setState(() {
          _errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
        });
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
                      decoration: const BoxDecoration(
                        color: AppColors.primarySoft,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.directions_bus_rounded,
                        size: 30,
                        color: AppColors.primaryNavy,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'تسجيل الدخول',
                    style: AppTypography.headlineLarge.copyWith(
                      color: AppColors.primaryNavy,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'مرحباً بك في نظام النقل المدرسي',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.secondaryText,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.errorRed.withValues(alpha: 0.1),
                        borderRadius: AppRadius.borderSm,
                        border: Border.all(color: AppColors.errorRed, width: 1),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.errorRed,
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                  AppTextField(
                    controller: _emailController,
                    label: 'البريد الإلكتروني / رقم الهوية',
                    hintText: 'أدخل بريدك الإلكتروني أو رقم الهوية',
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Icons.email_outlined,
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'يرجى إدخال البريد الإلكتروني';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _passwordController,
                    label: 'كلمة المرور',
                    hintText: 'أدخل كلمة المرور الخاصة بك',
                    obscureText: true,
                    prefixIcon: Icons.lock_outline_rounded,
                    validator: (val) {
                      if (val == null || val.isEmpty) {
                        return 'يرجى إدخال كلمة المرور';
                      }
                      if (val.length < 6) {
                        return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          SizedBox(
                            width: 24,
                            height: 24,
                            child: Checkbox(
                              value: _rememberMe,
                              onChanged: (val) {
                                setState(() {
                                  _rememberMe = val ?? true;
                                });
                              },
                              activeColor: AppColors.primaryNavy,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'تذكرني',
                            style: AppTypography.bodyMedium,
                          ),
                        ],
                      ),
                      TextButton(
                        onPressed: () => context.push('/auth/forgot-password'),
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: const Size(0, 0),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: Text(
                          'نسيت كلمة المرور؟',
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.primaryNavy,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : PrimaryButton(
                          text: 'تسجيل الدخول',
                          onPressed: _handleLogin,
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

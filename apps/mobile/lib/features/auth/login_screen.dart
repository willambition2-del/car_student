import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/constants/app_constants.dart';

import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';
import 'services/auth_service.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'parent1@example.com');
  final _passwordController = TextEditingController(text: 'Parent@2026!Dev');
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

        if (userRole == 'PARENT') {
          ref.read(selectedRoleProvider.notifier).state = UserRole.parent;
          context.go('/parent/home');
        } else if (userRole == 'SUPERVISOR') {
          ref.read(selectedRoleProvider.notifier).state = UserRole.supervisor;
          context.go('/supervisor/home');
        } else if (userRole == 'DRIVER') {
          ref.read(selectedRoleProvider.notifier).state = UserRole.driver;
          context.go('/driver/home');
        } else if (userRole == 'SCHOOL_ADMIN' ||
            userRole == 'TRANSPORT_MANAGER' ||
            userRole == 'SCHOOL_OWNER') {
          ref.read(selectedRoleProvider.notifier).state = UserRole.transportManager;
          context.go('/transport/home');
        } else {
          // Default fallback if role is unknown, maybe parent
          ref.read(selectedRoleProvider.notifier).state = UserRole.parent;
          context.go('/parent/home');
        }
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
      showRoleSwitcher: true,
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
                  
                  const SizedBox(height: 10),

                                  ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _DemoRoleChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _DemoRoleChip({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      avatar: Icon(icon, size: 16, color: AppColors.primaryNavy),
      label: Text(label),
      labelStyle: AppTypography.caption.copyWith(
        color: AppColors.primaryNavy,
        fontWeight: FontWeight.w700,
      ),
      backgroundColor: AppColors.primarySoft,
      side: const BorderSide(color: AppColors.primaryBorder, width: 1),
      onPressed: onTap,
    );
  }
}

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/constants/app_constants.dart';
import '../../core/storage/secure_storage_service.dart';
import '../../mock/mock_repository.dart';
import '../../core/utils/role_route_mapper.dart';
import '../auth/services/auth_service.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeIn));

    _controller.forward();

    _timer = Timer(const Duration(seconds: 2), () async {
      try {
        final token = await SecureStorageService.getAccessToken();
        final hasSeenOnboarding = await SecureStorageService.hasSeenOnboarding();

        if (token != null && token.isNotEmpty) {
          try {
            // Validate with backend
            final data = await AuthService().verifySession();
            final userRole = data['user']?['role']?.toString() ?? data['role']?.toString();

            if (userRole != null) {
              ref.read(selectedRoleProvider.notifier).state = RoleRouteMapper.getUserRoleEnum(userRole);
              if (mounted) {
                // Let app_router handle the actual redirection by going to a public path that forwards, or directly to home.
                // But better: we go to auth/login and let the router intercept it, OR directly to the home screen.
                context.go('/auth/login');
              }
              return;
            }
          } catch (e) {
            // Verification failed (e.g. 401). Interceptor already cleared storage if refresh failed.
            await SecureStorageService.clearAuthData();
          }
        }
        
        if (mounted) {
          if (hasSeenOnboarding) {
            context.go('/auth/login');
          } else {
            context.go('/onboarding');
          }
        }
      } catch (e) {
        // Fallback in case storage throws exception
        if (mounted) {
          context.go('/auth/login');
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 88,
                    height: 88,
                    decoration: BoxDecoration(
                      color: AppColors.primaryNavy,
                      borderRadius: AppRadius.borderLg,
                    ),
                    child: const Icon(
                      Icons.directions_bus_rounded,
                      size: 48,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    AppConstants.appName,
                    style: AppTypography.displayLarge.copyWith(
                      color: AppColors.primaryNavy,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    AppConstants.appTagline,
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.secondaryText,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  const SizedBox(
                    width: 22,
                    height: 22,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.primaryNavy,
                    ),
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

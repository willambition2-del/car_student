import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/storage/secure_storage_service.dart';

class OnboardingItem {
  final String title;
  final String description;
  final IconData icon;

  const OnboardingItem({
    required this.title,
    required this.description,
    required this.icon,
  });
}

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<OnboardingItem> _pages = const [
    OnboardingItem(
      title: 'متابعة مسارات النقل المدرسي',
      description:
          'متابعة نقاط التجمع ومسار الحافلة المعتمد والجداول الزمنية بدقة ووضوح.',
      icon: Icons.alt_route_rounded,
    ),
    OnboardingItem(
      title: 'إشعارات الصعود والوصول',
      description:
          'تلقَّ إشعارات فورية عند صعود الطالب إلى الحافلة ووصوله الآمن للمدرسة أو المنزل.',
      icon: Icons.notifications_active_outlined,
    ),
    OnboardingItem(
      title: 'إدارة الطلبات والغياب',
      description:
          'تقديم طلبات الغياب وتغيير العنوان ومتابعة السجلات الإدارية بسهولة وموثوقية.',
      icon: Icons.assignment_turned_in_outlined,
    ),
  ];

  void _onNext() async {
    if (_currentIndex < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
      );
    } else {
      await SecureStorageService.setHasSeenOnboarding(true);
      if (mounted) context.go('/auth/login');
    }
  }

  void _onSkip() async {
    await SecureStorageService.setHasSeenOnboarding(true);
    if (mounted) context.go('/auth/login');
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'نظام النقل المدرسي',
                      style: AppTypography.titleMedium.copyWith(
                        color: AppColors.primaryNavy,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    if (_currentIndex < _pages.length - 1)
                      TextButton(
                        onPressed: _onSkip,
                        child: Text(
                          'تخطي',
                          style: AppTypography.titleMedium.copyWith(
                            color: AppColors.secondaryText,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) => setState(() => _currentIndex = index),
                  itemCount: _pages.length,
                  itemBuilder: (context, index) {
                    final page = _pages[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: AppRadius.borderLg,
                              border: Border.all(color: AppColors.primaryBorder, width: 1),
                            ),
                            child: Icon(
                              page.icon,
                              size: 56,
                              color: AppColors.primaryNavy,
                            ),
                          ),
                          const SizedBox(height: 32),
                          Text(
                            page.title,
                            style: AppTypography.headlineLarge.copyWith(
                              color: AppColors.primaryNavy,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            page.description,
                            style: AppTypography.bodyMedium.copyWith(
                              color: AppColors.secondaryText,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _pages.length,
                        (idx) => AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          height: 6,
                          width: _currentIndex == idx ? 20 : 6,
                          decoration: BoxDecoration(
                            color: _currentIndex == idx
                                ? AppColors.primaryNavy
                                : AppColors.border,
                            borderRadius: AppRadius.borderFull,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    PrimaryButton(
                      text: _currentIndex == _pages.length - 1 ? 'تسجيل الدخول' : 'التالي',
                      onPressed: _onNext,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

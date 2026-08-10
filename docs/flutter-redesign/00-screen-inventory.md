# جرد واجهات ومكونات تطبيق Flutter المحدثة

## 1. تصميم النظام البصري (Design System)
- `lib/app/theme/app_colors.dart`: الألوان الرسمية للمؤسسات (Deep Corporate Navy #123B5D, Primary Blue #174A70, Background #F7F8FA, Surface #FFFFFF).
- `lib/app/theme/app_typography.dart`: السلم الخطي والخطوط العربية المعتمدة (Cairo/Tajawal Scale).
- `lib/app/theme/app_radius.dart`: انحناءات متوازنة للبطاقات والحقول (8px - 14px).
- `lib/app/theme/app_spacing.dart`: مقاييس الفراغات والمحاذاة الموحدة (4, 8, 12, 16, 20, 24, 32).
- `lib/app/theme/app_shadows.dart`: ظلال هادئة وغير مزعجة مع حدود دقيقة.
- `lib/app/theme/app_theme.dart`: إعدادات ThemeData الموحدة لبرنامج Material 3.

## 2. المكونات المشتركة (Shared Core Widgets)
- `lib/core/widgets/app_top_bar.dart`: شريط العنوان العلوي المؤسسي.
- `lib/core/widgets/app_buttons.dart`: أزرار الإجراءات الرئيسية والثانوية والخطيرة بحجم 48px وحالات تحميل.
- `lib/core/widgets/app_text_fields.dart`: حقول الإدخال، حقل كلمة المرور مع إمكانية الإظهار/الإخفاء، وحقول البحث.
- `lib/core/widgets/bottom_navigation.dart`: شريط التنقل السفلي بحسب صلاحيات ودور المستخدم.
- `lib/core/widgets/status_badge.dart`: بطاقات وحالات الصعود والوصول والغياب والطلب.
- `lib/core/widgets/dialogs_sheets.dart`: الحوارات ونوافذ التأكيد التفاعلية.
- `lib/core/widgets/state_widgets.dart`: حالات التحميل، الشاشات الفارغة، وحالة عدم الاتصال بالشبكة.
- `lib/core/widgets/student_widgets.dart`: صور رمزيّة وبطاقات الطلاب المحدثة.
- `lib/core/widgets/bus_widgets.dart`: بطاقات الحافلات والرحلات.

## 3. شاشات المصادقة والتجهيز (Auth & Onboarding)
- `lib/features/splash/splash_screen.dart`
- `lib/features/onboarding/onboarding_screen.dart`
- `lib/features/auth/login_screen.dart`
- `lib/features/auth/forgot_password_screen.dart`
- `lib/features/auth/otp_screen.dart`
- `lib/features/auth/reset_password_screen.dart`
- `lib/features/auth/change_password_screen.dart`

## 4. شاشات تجربة ولي الأمر (Parent Experience)
- `lib/features/parent/parent_home_screen.dart`
- `lib/features/parent/parent_trip_details_screen.dart`
- `lib/features/parent/parent_route_map_screen.dart`
- `lib/features/parent/map_location_picker_screen.dart`
- `lib/features/parent/absence_request_screen.dart`
- `lib/features/parent/absence_history_screen.dart`
- `lib/features/parent/address_change_request_screen.dart`
- `lib/features/parent/address_requests_list_screen.dart`
- `lib/features/parent/address_request_details_screen.dart`
- `lib/features/parent/select_student_screen.dart`
- `lib/features/parent/student_details_screen.dart`
- `lib/features/parent/student_trip_history_screen.dart`

## 5. شاشات تجربة المشرفة الميدانية (Supervisor Experience)
- `lib/features/supervisor/supervisor_home_screen.dart`
- `lib/features/supervisor/supervisor_active_trip_screen.dart`
- `lib/features/supervisor/school_arrival_screen.dart`
- `lib/features/supervisor/supervisor_end_trip_screen.dart`
- `lib/features/supervisor/student_in_trip_details_screen.dart`
- `lib/features/supervisor/supervisor_trips_list_screen.dart`
- `lib/features/supervisor/sync_log_list_screen.dart`
- `lib/features/supervisor/sync_operation_details_screen.dart`

## 6. شاشات تجربة السائق (Driver Experience)
- `lib/features/driver/driver_home_screen.dart`
- `lib/features/driver/driver_active_trip_screen.dart`
- `lib/features/driver/driver_route_details_screen.dart`
- `lib/features/driver/driver_reports_screen.dart`

## 7. شاشات تجربة مدير النقل (Transport Manager Experience)
- `lib/features/transport_manager/transport_manager_home_screen.dart`
- `lib/features/transport_manager/transport_operations_center_screen.dart`
- `lib/features/transport_manager/transport_alerts_screen.dart`
- `lib/features/transport_manager/transport_address_requests_screen.dart`
- `lib/features/transport_manager/transport_address_review_screen.dart`

## 8. الشاشات المشتركة والملف الشخصي (Shared & Profile)
- `lib/features/profile/parent_profile_screen.dart`
- `lib/features/profile/shared_profile_screen.dart`
- `lib/features/notifications/notifications_screen.dart`
- `lib/features/shared/general_search_screen.dart`
- `lib/features/shared/tech_support_screen.dart`

import 'package:go_router/go_router.dart';
import '../../core/storage/secure_storage_service.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/forgot_password_screen.dart';
import '../../features/auth/otp_screen.dart';
import '../../features/auth/reset_password_screen.dart';
import '../../features/auth/change_password_screen.dart';
import '../../features/parent/parent_home_screen.dart';
import '../../features/parent/select_student_screen.dart';
import '../../features/parent/parent_route_map_screen.dart';
import '../../features/parent/parent_trip_details_screen.dart';
import '../../features/parent/student_details_screen.dart';
import '../../features/parent/student_trip_history_screen.dart';
import '../../features/parent/address_change_request_screen.dart';
import '../../features/parent/map_location_picker_screen.dart';
import '../../features/parent/address_requests_list_screen.dart';
import '../../features/parent/address_request_details_screen.dart';
import '../../features/parent/absence_request_screen.dart';
import '../../features/parent/absence_history_screen.dart';
import '../../features/notifications/notifications_screen.dart';
import '../../features/profile/parent_profile_screen.dart';
import '../../features/supervisor/supervisor_home_screen.dart';
import '../../features/supervisor/supervisor_trips_list_screen.dart';
import '../../features/supervisor/supervisor_active_trip_screen.dart';
import '../../features/supervisor/student_in_trip_details_screen.dart';
import '../../features/supervisor/school_arrival_screen.dart';
import '../../features/supervisor/supervisor_end_trip_screen.dart';
import '../../features/supervisor/sync_log_list_screen.dart';
import '../../features/supervisor/sync_operation_details_screen.dart';

import '../../features/transport_manager/transport_manager_home_screen.dart';
import '../../features/transport_manager/transport_operations_center_screen.dart';
import '../../features/transport_manager/transport_address_requests_screen.dart';
import '../../features/transport_manager/transport_address_review_screen.dart';
import '../../features/transport_manager/transport_alerts_screen.dart';
import '../../features/profile/shared_profile_screen.dart';
import '../../features/shared/general_search_screen.dart';
import '../../features/shared/tech_support_screen.dart';

import '../../features/shared/unsupported_role_screen.dart';
import '../../core/utils/role_route_mapper.dart';

const _publicPaths = <String>{
  '/splash',
  '/onboarding',
  '/auth/login',
  '/auth/forgot-password',
  '/auth/otp',
  '/auth/reset-password',
};

String _homeForRole(String? role) {
  return RoleRouteMapper.getRouteForRole(role);
}

final GoRouter appRouter = GoRouter(
  redirect: (context, state) async {
    final path = state.uri.path;
    if (path == '/splash') return null;
    final token = await SecureStorageService.getAccessToken();
    final role = await SecureStorageService.getUserRole();
    final isAuthenticated = token != null && token.isNotEmpty && role != null;
    
    if (!isAuthenticated) {
      return _publicPaths.contains(path) ? null : '/auth/login';
    }

    // Check if user must change password
    final mustChangePassword = await SecureStorageService.getMustChangePassword();
    if (mustChangePassword) {
      // Allow them to be on change-password or logout (which redirects to login)
      if (path != '/auth/change-password' && path != '/auth/login') {
        return '/auth/change-password';
      }
    } else {
      if (path == '/auth/change-password') {
        return _homeForRole(role);
      }
    }

    if (_publicPaths.contains(path)) return _homeForRole(role);
    
    final isShared = path.startsWith('/shared/');
    final expectedPrefix = _homeForRole(role).split('/')[1];
    if (!isShared && !path.startsWith('/$expectedPrefix/')) {
      return _homeForRole(role);
    }
    return null;
  },
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (ctx, state) => const SplashScreen()),
    GoRoute(
      path: '/onboarding',
      builder: (ctx, state) => const OnboardingScreen(),
    ),
    GoRoute(path: '/auth/login', builder: (ctx, state) => const LoginScreen()),
    GoRoute(
      path: '/auth/forgot-password',
      builder: (ctx, state) => const ForgotPasswordScreen(),
    ),
    GoRoute(path: '/auth/otp', builder: (ctx, state) => const OtpScreen()),
    GoRoute(
      path: '/auth/reset-password',
      builder: (ctx, state) => const ResetPasswordScreen(),
    ),
    GoRoute(
      path: '/auth/change-password',
      builder: (ctx, state) => const ChangePasswordScreen(),
    ),

    // Parent Routes
    GoRoute(
      path: '/parent/home',
      builder: (ctx, state) => const ParentHomeScreen(),
    ),
    GoRoute(
      path: '/parent/select-student',
      builder: (ctx, state) => const SelectStudentScreen(),
    ),
    GoRoute(
      path: '/parent/route-map',
      builder: (ctx, state) => const ParentRouteMapScreen(),
    ),
    GoRoute(
      path: '/parent/trip-details',
      builder: (ctx, state) => const ParentTripDetailsScreen(),
    ),
    GoRoute(
      path: '/parent/student-details',
      builder: (ctx, state) => const StudentDetailsScreen(),
    ),
    GoRoute(
      path: '/parent/trip-history',
      builder: (ctx, state) => const StudentTripHistoryScreen(),
    ),
    GoRoute(
      path: '/parent/address-change-request',
      builder: (ctx, state) => const AddressChangeRequestScreen(),
    ),
    GoRoute(
      path: '/parent/map-location-picker',
      builder: (ctx, state) => const MapLocationPickerScreen(),
    ),
    GoRoute(
      path: '/parent/address-requests-list',
      builder: (ctx, state) => const AddressRequestsListScreen(),
    ),
    GoRoute(
      path: '/parent/address-request-details',
      builder: (ctx, state) => const AddressRequestDetailsScreen(),
    ),
    GoRoute(
      path: '/parent/absence-request',
      builder: (ctx, state) => const AbsenceRequestScreen(),
    ),
    GoRoute(
      path: '/parent/absence-history',
      builder: (ctx, state) => const AbsenceHistoryScreen(),
    ),
    GoRoute(
      path: '/parent/notifications',
      builder: (ctx, state) => const NotificationsScreen(),
    ),
    GoRoute(
      path: '/parent/profile',
      builder: (ctx, state) => const ParentProfileScreen(),
    ),

    // Supervisor Routes
    GoRoute(
      path: '/supervisor/home',
      builder: (ctx, state) => const SupervisorHomeScreen(),
    ),
    GoRoute(
      path: '/supervisor/trips',
      builder: (ctx, state) => const SupervisorTripsListScreen(),
    ),
    GoRoute(
      path: '/supervisor/trip/active',
      builder: (ctx, state) => const SupervisorActiveTripScreen(),
    ),
    GoRoute(
      path: '/supervisor/student-in-trip',
      builder: (ctx, state) => const StudentInTripDetailsScreen(),
    ),
    GoRoute(
      path: '/supervisor/school-arrival',
      builder: (ctx, state) => const SchoolArrivalScreen(),
    ),
    GoRoute(
      path: '/supervisor/end-trip',
      builder: (ctx, state) => const SupervisorEndTripScreen(),
    ),
    GoRoute(
      path: '/supervisor/sync',
      builder: (ctx, state) => const SyncLogListScreen(),
    ),
    GoRoute(
      path: '/supervisor/sync-details',
      builder: (ctx, state) => const SyncOperationDetailsScreen(),
    ),


    // Transport Manager Routes
    GoRoute(
      path: '/transport/home',
      builder: (ctx, state) => const TransportManagerHomeScreen(),
    ),
    GoRoute(
      path: '/transport/operations',
      builder: (ctx, state) => const TransportOperationsCenterScreen(),
    ),
    GoRoute(
      path: '/transport/address-requests',
      builder: (ctx, state) => const TransportAddressRequestsScreen(),
    ),
    GoRoute(
      path: '/transport/address-review',
      builder: (ctx, state) => const TransportAddressReviewScreen(),
    ),
    GoRoute(
      path: '/transport/alerts',
      builder: (ctx, state) => const TransportAlertsScreen(),
    ),

    // Shared Routes
    GoRoute(
      path: '/shared/profile',
      builder: (ctx, state) => const SharedProfileScreen(),
    ),
    GoRoute(
      path: '/shared/search',
      builder: (ctx, state) => const GeneralSearchScreen(),
    ),
    GoRoute(
      path: '/shared/support',
      builder: (ctx, state) => const TechSupportScreen(),
    ),
    GoRoute(
      path: '/unsupported-role',
      builder: (ctx, state) => const UnsupportedRoleScreen(),
    ),
  ],
);

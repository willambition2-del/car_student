import '../../mock/models/models.dart';

class RoleRouteMapper {
  static String getRouteForRole(String? role) {
    if (role == null) return '/auth/login';
    
    switch (role.toUpperCase()) {
      case 'PARENT':
        return '/parent/home';
      case 'SUPERVISOR':
        return '/supervisor/home';

      case 'TRANSPORT_MANAGER':
      case 'SCHOOL_ADMIN':
      case 'SCHOOL_OWNER':
        return '/transport/home';
      case 'DRIVER':
      case 'ACCOUNTANT':
      case 'PLATFORM_ADMIN':
      default:
        return '/unsupported-role';
    }
  }

  static UserRole? getUserRoleEnum(String? role) {
    switch (role?.toUpperCase()) {
      case 'PARENT':
        return UserRole.parent;
      case 'SUPERVISOR':
        return UserRole.supervisor;

      case 'TRANSPORT_MANAGER':
      case 'SCHOOL_OWNER':
        return UserRole.transportManager;
      case 'SCHOOL_ADMIN':
        return UserRole.schoolAdmin;
      case 'ACCOUNTANT':
        return UserRole.accountant;
      case 'PLATFORM_ADMIN':
        return UserRole.platformAdmin;
      default:
        return null; // NO FALLBACK
    }
  }
}

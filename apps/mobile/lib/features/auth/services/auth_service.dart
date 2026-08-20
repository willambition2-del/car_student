import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';

class AuthService {
  final ApiClient _apiClient = ApiClient();

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
    String deviceInfo = 'Flutter Mobile App',
  }) async {
    final data = await _apiClient.post(
      '/auth/login',
      data: {'email': email, 'password': password, 'deviceInfo': deviceInfo},
    );

    final user = data['user'] as Map<String, dynamic>;
    final school = data['school'] as Map<String, dynamic>?;

    await SecureStorageService.saveAuthData(
      accessToken: data['accessToken'].toString(),
      refreshToken: data['refreshToken'].toString(),
      userId: user['id'].toString(),
      userRole: user['role'].toString(),
      email: user['email'].toString(),
      fullName: user['fullName'].toString(),
      mustChangePassword:
          (user['mustChangePassword'] as bool?) ??
          (data['mustChangePassword'] as bool?) ??
          false,
      schoolId: school?['id']?.toString(),
    );

    return data;
  }

  Future<Map<String, dynamic>> verifySession() async {
    final data = await _apiClient.get('/auth/me');

    final user = data['user'] as Map<String, dynamic>? ?? data;

    // Update local cached role/email if necessary from backend response
    if (user['role'] != null) {
      final oldRole = await SecureStorageService.getUserRole();
      if (oldRole != user['role'].toString()) {
        await SecureStorageService.saveAuthData(
          accessToken: (await SecureStorageService.getAccessToken()) ?? '',
          refreshToken: (await SecureStorageService.getRefreshToken()) ?? '',
          userId: user['id']?.toString() ?? '',
          userRole: user['role'].toString(),
          email: user['email']?.toString() ?? '',
          fullName: user['fullName']?.toString() ?? '',
          mustChangePassword: user['mustChangePassword'] as bool? ?? false,
          schoolId: user['schoolId']?.toString(),
        );
      }
    }

    return data;
  }

  Future<void> forgotPassword(String email) async {
    await _apiClient.post('/auth/forgot-password', data: {'email': email});
  }

  Future<String> verifyOtp(String email, String otp) async {
    final data = await _apiClient.post(
      '/auth/verify-otp',
      data: {'email': email, 'otp': otp},
    );
    return data['resetToken'].toString();
  }

  Future<void> resetPassword(
    String email,
    String otp,
    String newPassword,
  ) async {
    await _apiClient.post(
      '/auth/reset-password',
      data: {'email': email, 'otp': otp, 'newPassword': newPassword},
    );
  }

  Future<void> changePassword(
    String currentPassword,
    String newPassword,
  ) async {
    await _apiClient.post(
      '/auth/change-password',
      data: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      },
    );
    await SecureStorageService.setMustChangePassword(false);
  }

  Future<void> logout() async {
    final refreshToken = await SecureStorageService.getRefreshToken();
    try {
      if (refreshToken != null) {
        await _apiClient.post(
          '/auth/logout',
          data: {'refreshToken': refreshToken},
        );
      }
    } catch (_) {
      // Ignore network errors on logout
    } finally {
      await SecureStorageService.clearAuthData();
    }
  }
}

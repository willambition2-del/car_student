import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage();

  static const String _keyAccessToken = 'access_token';
  static const String _keyRefreshToken = 'refresh_token';
  static const String _keyUserId = 'user_id';
  static const String _keyUserRole = 'user_role';
  static const String _keyUserEmail = 'user_email';
  static const String _keyUserFullName = 'user_fullname';
  static const String _keySchoolId = 'school_id';
  static const String _keyMustChangePassword = 'must_change_password';
  static const String _keyHasSeenOnboarding = 'has_seen_onboarding';

  static Future<void> saveAuthData({
    required String accessToken,
    required String refreshToken,
    required String userId,
    required String userRole,
    required String email,
    required String fullName,
    bool mustChangePassword = false,
    String? schoolId,
  }) async {
    await _storage.write(key: _keyAccessToken, value: accessToken);
    await _storage.write(key: _keyRefreshToken, value: refreshToken);
    await _storage.write(key: _keyUserId, value: userId);
    await _storage.write(key: _keyUserRole, value: userRole);
    await _storage.write(key: _keyUserEmail, value: email);
    await _storage.write(key: _keyUserFullName, value: fullName);
    await _storage.write(
      key: _keyMustChangePassword,
      value: mustChangePassword.toString(),
    );
    if (schoolId != null) {
      await _storage.write(key: _keySchoolId, value: schoolId);
    }
  }

  static Future<void> updateTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _keyAccessToken, value: accessToken);
    await _storage.write(key: _keyRefreshToken, value: refreshToken);
  }

  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _keyAccessToken);
  }

  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _keyRefreshToken);
  }

  static Future<String?> getUserRole() async {
    return await _storage.read(key: _keyUserRole);
  }

  static Future<String?> getUserId() async {
    return await _storage.read(key: _keyUserId);
  }

  static Future<String?> getSchoolId() async {
    return await _storage.read(key: _keySchoolId);
  }

  static Future<String?> getUserFullName() async {
    return await _storage.read(key: _keyUserFullName);
  }

  static Future<bool> getMustChangePassword() async {
    final value = await _storage.read(key: _keyMustChangePassword);
    return value == 'true';
  }

  static Future<void> setMustChangePassword(bool value) async {
    await _storage.write(key: _keyMustChangePassword, value: value.toString());
  }

  static Future<void> clearAuthData() async {
    await _storage.delete(key: _keyAccessToken);
    await _storage.delete(key: _keyRefreshToken);
    await _storage.delete(key: _keyUserId);
    await _storage.delete(key: _keyUserRole);
    await _storage.delete(key: _keyUserEmail);
    await _storage.delete(key: _keyUserFullName);
    await _storage.delete(key: _keySchoolId);
    await _storage.delete(key: _keyMustChangePassword);
  }

  static Future<void> setHasSeenOnboarding(bool value) async {
    await _storage.write(key: _keyHasSeenOnboarding, value: value.toString());
  }

  static Future<bool> hasSeenOnboarding() async {
    final val = await _storage.read(key: _keyHasSeenOnboarding);
    return val == 'true';
  }
}

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../storage/secure_storage_service.dart';

class ApiClient {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: kIsWeb
        ? 'http://localhost:3000/api/v1'
        : 'http://10.0.2.2:3000/api/v1', // Android emulator default
  );

  late final Dio dio;
  late final Dio _refreshDio;
  Future<String?>? _refreshFuture;

  ApiClient() {
    final apiUri = Uri.parse(baseUrl);
    if (kReleaseMode && apiUri.scheme != 'https') {
      throw StateError('API_BASE_URL must use HTTPS in release builds');
    }

    final options = BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    dio = Dio(options);
    _refreshDio = Dio(dio.options);
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final sameOrigin = options.uri.origin == apiUri.origin;
          final token = sameOrigin
              ? await SecureStorageService.getAccessToken()
              : null;
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          final request = error.requestOptions;
          final isAuthEndpoint = request.path.startsWith('/auth/');
          final alreadyRetried = request.extra['authRetried'] == true;
          if (error.response?.statusCode == 401 &&
              !isAuthEndpoint &&
              !alreadyRetried) {
            final accessToken = await _refreshAccessToken();
            if (accessToken != null) {
              request.extra['authRetried'] = true;
              request.headers['Authorization'] = 'Bearer $accessToken';
              try {
                final response = await dio.fetch<dynamic>(request);
                return handler.resolve(response);
              } on DioException catch (retryError) {
                await SecureStorageService.clearAuthData();
                return handler.next(retryError);
              }
            }
            await SecureStorageService.clearAuthData();
          }
          return handler.next(error);
        },
      ),
    );
  }

  Future<String?> _refreshAccessToken() {
    final pending = _refreshFuture;
    if (pending != null) return pending;

    final refresh = _performTokenRefresh();
    _refreshFuture = refresh;
    refresh.whenComplete(() {
      if (identical(_refreshFuture, refresh)) _refreshFuture = null;
    });
    return refresh;
  }

  Future<String?> _performTokenRefresh() async {
    final refreshToken = await SecureStorageService.getRefreshToken();
    if (refreshToken == null) return null;

    try {
      final response = await _refreshDio.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      final envelope = response.data;
      final data = envelope?['data'] as Map<String, dynamic>?;
      final accessToken = data?['accessToken']?.toString();
      final rotatedRefreshToken = data?['refreshToken']?.toString();
      if (accessToken == null || rotatedRefreshToken == null) return null;

      await SecureStorageService.updateTokens(
        accessToken: accessToken,
        refreshToken: rotatedRefreshToken,
      );
      return accessToken;
    } on DioException {
      return null;
    }
  }

  Future<Map<String, dynamic>> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      if (response.data is Map<String, dynamic>) {
        final resMap = response.data as Map<String, dynamic>;
        if (resMap['success'] == true) {
          return resMap['data'] as Map<String, dynamic>? ?? resMap;
        }
      }
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await dio.get(path, queryParameters: queryParameters);
      if (response.data is Map<String, dynamic>) {
        final resMap = response.data as Map<String, dynamic>;
        if (resMap['success'] == true) {
          return resMap['data'] as Map<String, dynamic>? ?? resMap;
        }
      }
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  Exception _parseError(DioException e) {
    if (e.response != null && e.response?.data is Map<String, dynamic>) {
      final errData = e.response!.data['error'];
      if (errData != null && errData['message'] != null) {
        return Exception(errData['message'].toString());
      }
    }
    return Exception(
      'حدث خطأ في الاتصال بالخادم. يرجى التأكد من تشغيل الشبكة.',
    );
  }
}

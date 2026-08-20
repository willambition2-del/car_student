import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:unifiedpush/unifiedpush.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class PushService {
  static final PushService _instance = PushService._internal();
  factory PushService() => _instance;
  PushService._internal();

  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  final _storage = const FlutterSecureStorage();
  final Dio _dio = Dio();
  
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    // 1. Initialize FlutterLocalNotificationsPlugin for system tray display
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      settings: initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
    );

    // Create Notification Channel for Android
    const androidChannel = AndroidNotificationChannel(
      'school_bus_alerts',
      'تنبيهات النقل المدرسي',
      description: 'إشعارات صعود ونزول الطلاب وتحديثات الرحلات المدرسية',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    await _localNotifications
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidChannel);

    // 2. Initialize UnifiedPush / ntfy receiver
    UnifiedPush.initialize(
      onNewEndpoint: _onNewEndpoint,
      onRegistrationFailed: _onRegistrationFailed,
      onUnregistered: _onUnregistered,
      onMessage: _onMessage,
    );

    _initialized = true;
  }

  void _onNotificationTap(NotificationResponse response) {
    if (response.payload != null) {
      try {
        final data = jsonDecode(response.payload!);
        // Handle deep linking or routing based on data['actionType'] or data['entityType']
        print("Tapped notification with payload: $data");
      } catch (e) {
        print("Error parsing payload: $e");
      }
    }
  }

  void _onNewEndpoint(PushEndpoint endpoint, String instance) async {
    print("Received new UnifiedPush endpoint: ${endpoint.url}");
    
    // Save to local storage
    await _storage.write(key: 'push_endpoint', value: endpoint.url);
    
    // Send endpoint to the backend to register the device.
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token != null) {
        final apiBaseUrl = const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://2.24.141.70:3210/api/v1');
        final url = '$apiBaseUrl/school/notifications/register-device';
        await _dio.post(
          url,
          options: Options(
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
          ),
          data: {
            'endpoint': endpoint.url,
            'pushProvider': 'UNIFIED_PUSH',
            'platform': 'ANDROID',
          },
        );
      }
    } catch (e) {
      print("Failed to register endpoint with backend: $e");
    }
  }

  void _onRegistrationFailed(FailedReason reason, String instance) {
    print("UnifiedPush registration failed for instance: $instance. Reason: $reason");
  }

  void _onUnregistered(String instance) {
    print("UnifiedPush unregistered for instance: $instance");
  }

  void _onMessage(PushMessage message, String instance) {
    final messageText = utf8.decode(message.content);
    print("UnifiedPush message received: $messageText");
    try {
      final payload = jsonDecode(messageText);
      _showLocalNotification(payload);
    } catch (e) {
      print("Failed to parse push message: $e");
      // If it's raw text, show it as a simple notification
      _showLocalNotification({'title': 'إشعار جديد', 'message': messageText});
    }
  }

  Future<void> _showLocalNotification(Map<String, dynamic> payload) async {
    final title = payload['title'] ?? 'إشعار جديد';
    final body = payload['message'] ?? '';
    final type = payload['data']?['type'] ?? 'GENERAL';
    
    final channelId = (type == 'TRIP_STARTED' || type == 'STUDENT_BOARDED' || type == 'STUDENT_DROPPED_OFF')
        ? 'trip_updates'
        : 'general';

    final androidPlatformChannelSpecifics = AndroidNotificationDetails(
      channelId,
      channelId == 'trip_updates' ? 'Trip Updates' : 'General Notifications',
      importance: channelId == 'trip_updates' ? Importance.high : Importance.defaultImportance,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
    );

    final platformChannelSpecifics = NotificationDetails(android: androidPlatformChannelSpecifics);

    await _localNotifications.show(
      id: DateTime.now().millisecond, // Basic random ID
      title: title,
      body: body,
      notificationDetails: platformChannelSpecifics,
      payload: jsonEncode(payload['data'] ?? {}),
    );
  }
}

import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../mock/models/models.dart';
import '../storage/secure_storage_service.dart';
import '../../features/supervisor/services/trip_service.dart';

final syncServiceProvider = Provider((ref) => SyncService(ref));

class SyncOperation {
  final String id;
  final String tripId;
  final String studentId;
  final String studentName;
  final String status;
  final DateTime timestamp;
  int retryCount;
  String? failureReason;
  String syncStatus;

  SyncOperation({
    required this.id,
    required this.tripId,
    required this.studentId,
    required this.studentName,
    required this.status,
    required this.timestamp,
    this.retryCount = 0,
    this.failureReason,
    this.syncStatus = 'PENDING',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'tripId': tripId,
        'studentId': studentId,
        'studentName': studentName,
        'status': status,
        'timestamp': timestamp.toIso8601String(),
        'retryCount': retryCount,
        'failureReason': failureReason,
        'syncStatus': syncStatus,
      };

  factory SyncOperation.fromJson(Map<String, dynamic> json) => SyncOperation(
        id: json['id'],
        tripId: json['tripId'],
        studentId: json['studentId'],
        studentName: json['studentName'],
        status: json['status'],
        timestamp: DateTime.parse(json['timestamp']),
        retryCount: json['retryCount'] ?? 0,
        failureReason: json['failureReason'],
        syncStatus: json['syncStatus'] ?? 'PENDING',
      );
}

class SyncService {
  final Ref _ref;
  static const String _queueKey = 'sync_queue';

  SyncService(this._ref);

  Future<List<SyncOperation>> getQueue() async {
    const storage = FlutterSecureStorage();
    final data = await storage.read(key: _queueKey);
    if (data == null) return [];
    try {
      final List decoded = jsonDecode(data);
      return decoded.map((e) => SyncOperation.fromJson(e)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<void> _saveQueue(List<SyncOperation> queue) async {
    const storage = FlutterSecureStorage();
    final data = jsonEncode(queue.map((e) => e.toJson()).toList());
    await storage.write(key: _queueKey, value: data);
  }

  Future<void> enqueueOperation({
    required String tripId,
    required String studentId,
    required String studentName,
    required String status,
  }) async {
    final queue = await getQueue();
    final op = SyncOperation(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      tripId: tripId,
      studentId: studentId,
      studentName: studentName,
      status: status,
      timestamp: DateTime.now(),
    );
    queue.add(op);
    await _saveQueue(queue);
  }

  Future<void> processQueue() async {
    final queue = await getQueue();
    if (queue.isEmpty) return;

    final tripService = _ref.read(tripServiceProvider);
    bool changed = false;

    for (var op in queue) {
      if (op.syncStatus == 'SYNCED') continue;

      try {
        await tripService.updateStudentStatus(
          op.tripId,
          op.studentId,
          StudentTripStatus.values.firstWhere((e) => e.name.toUpperCase() == op.status.toUpperCase()),
        );
        op.syncStatus = 'SYNCED';
        op.failureReason = null;
      } catch (e) {
        op.syncStatus = 'FAILED';
        op.retryCount++;
        op.failureReason = e.toString();
      }
      changed = true;
    }

    if (changed) {
      // Remove synced operations
      queue.removeWhere((op) => op.syncStatus == 'SYNCED');
      await _saveQueue(queue);
    }
  }
}

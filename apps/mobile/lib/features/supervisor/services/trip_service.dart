import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../mock/mock_repository.dart';
import '../../../mock/models/models.dart';

final tripServiceProvider = Provider((ref) => TripService(ref.read(apiClientProvider)));

class TripService {
  final ApiClient _apiClient;

  TripService(this._apiClient);

  Future<TripModel?> getActiveTrip() async {
    try {
      final response = await _apiClient.get('/school/trips', queryParameters: {'status': 'STARTED'});
      final data = response['data'];
      List? tripsList;
      if (data is List) {
        tripsList = data;
      } else if (data != null && data['items'] is List) {
        tripsList = data['items'];
      }
      
      if (tripsList != null && tripsList.isNotEmpty) {
        return TripModel.fromJson(tripsList.first as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      throw Exception('Failed to fetch active trip: $e');
    }
  }

  Future<List<TripModel>> getScheduledTrips() async {
    try {
      final response = await _apiClient.get('/school/trips', queryParameters: {'status': 'SCHEDULED'});
      final data = response['data'];
      List? tripsList;
      if (data is List) {
        tripsList = data;
      } else if (data != null && data['items'] is List) {
        tripsList = data['items'];
      }
      
      if (tripsList != null) {
        return tripsList.map((e) => TripModel.fromJson(e as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      throw Exception('Failed to fetch scheduled trips: $e');
    }
  }

  Future<TripModel> startTrip(String tripId) async {
    try {
      final response = await _apiClient.post('/school/trips/start', data: {'tripId': tripId});
      final data = response['data'];
      if (data != null) {
        return TripModel.fromJson(data as Map<String, dynamic>);
      }
      throw Exception('Invalid response');
    } catch (e) {
      throw Exception('Failed to start trip: $e');
    }
  }

  Future<void> completeTrip(String tripId) async {
    try {
      await _apiClient.post('/school/trips/$tripId/complete');
    } catch (e) {
      throw Exception('Failed to complete trip: $e');
    }
  }

  Future<void> updateStudentStatus(String tripId, String studentId, StudentTripStatus status, {String? notes}) async {
    try {
      await _apiClient.post('/school/trips/$tripId/student-status', data: {
        'studentId': studentId,
        'status': status.name.toUpperCase(),
        if (notes != null) 'notes': notes,
      });
    } catch (e) {
      throw Exception('Failed to update student status: $e');
    }
  }

  Future<List<StudentModel>> getTripStudents(String tripId) async {
    try {
      final response = await _apiClient.get('/school/trips/$tripId');
      final data = response['data'];
      if (data != null && data['tripStudents'] != null) {
        final studentsList = data['tripStudents'] as List;
        return studentsList.map((e) {
          final s = e['student'];
          return StudentModel(
            id: s['id'] ?? '',
            name: '${s['firstName']} ${s['lastName']}',
            grade: s['grade'] ?? '',
            section: s['section'] ?? '',
            schoolName: '',
            busNumber: '',
            routeName: '',
            pickupPoint: '',
            dropoffPoint: '',
            parentName: '',
            parentPhone: '',
            subscriptionStatus: 'ACTIVE',
            currentStatus: StudentTripStatus.values.firstWhere(
              (st) => st.name.toUpperCase() == (e['status'] ?? 'WAITING'),
              orElse: () => StudentTripStatus.waiting,
            ),
            avatarUrl: '',
          );
        }).toList();
      }
      return [];
    } catch (e) {
      throw Exception('Failed to fetch trip students: $e');
    }
  }
}

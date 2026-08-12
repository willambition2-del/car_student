import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../mock/mock_repository.dart';
import '../../../mock/models/models.dart';

final requestsServiceProvider = Provider((ref) => RequestsService(ref.read(apiClientProvider)));

class RequestsService {
  final ApiClient _apiClient;

  RequestsService(this._apiClient);

  Future<List<AddressRequestModel>> getAddressRequests() async {
    try {
      final response = await _apiClient.get('/school/address-requests');
      final data = response['data'];
      List? reqList;
      if (data is List) {
        reqList = data;
      } else if (data != null && data['items'] is List) {
        reqList = data['items'];
      }
      
      if (reqList != null) {
        return reqList.map((e) => AddressRequestModel(
          id: e['id'] ?? '',
          studentName: e['studentName'] ?? 'طالب غير معروف',
          currentAddress: e['oldAddress'] ?? '',
          newAddress: e['newAddress'] ?? '',
          type: AddressRequestType.permanent,
          reason: e['reason'] ?? '',
          startDate: e['createdAt'] != null ? DateTime.parse(e['createdAt']).toString() : '',
          nearestLandmark: '',
          status: RequestStatus.newReq,
          schoolNotes: '',
        )).toList();
      }
      return [];
    } catch (e) {
      throw Exception('Failed to fetch address requests: $e');
    }
  }

  Future<void> resolveAddressRequest(String id, bool approve, {String? notes}) async {
    final action = approve ? 'approve' : 'reject';
    try {
      await _apiClient.post('/school/address-requests/$id/$action', data: {
        if (!approve) 'reason': notes ?? 'مرفوض',
        if (approve && notes != null) 'notes': notes,
      });
    } catch (e) {
      throw Exception('Failed to resolve address request: $e');
    }
  }

  Future<List<AbsenceRequestModel>> getAbsenceRequests() async {
    try {
      final response = await _apiClient.get('/school/absence-requests');
      final data = response['data'];
      List? reqList;
      if (data is List) {
        reqList = data;
      } else if (data != null && data['items'] is List) {
        reqList = data['items'];
      }
      
      if (reqList != null) {
        return reqList.map((e) => AbsenceRequestModel(
          id: e['id'] ?? '',
          studentName: e['studentName'] ?? 'طالب غير معروف',
          type: 'غياب',
          startDate: e['startDate'] ?? '',
          reason: e['reason'] ?? '',
          status: e['status'] ?? 'NEW',
        )).toList();
      }
      return [];
    } catch (e) {
      throw Exception('Failed to fetch absence requests: $e');
    }
  }

  Future<void> resolveAbsenceRequest(String id, bool approve, {String? notes}) async {
    final action = approve ? 'approve' : 'reject';
    try {
      await _apiClient.post('/school/absence-requests/$id/$action', data: {
        if (!approve) 'reason': notes ?? 'مرفوض',
        if (approve && notes != null) 'notes': notes,
      });
    } catch (e) {
      throw Exception('Failed to resolve absence request: $e');
    }
  }
}

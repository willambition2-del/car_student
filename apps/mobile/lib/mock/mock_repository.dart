import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/sync/sync_service.dart';
import '../features/transport_manager/services/requests_service.dart';
import '../features/supervisor/services/trip_service.dart';

import '../core/network/api_client.dart';
import 'models/models.dart';

class MockData {
  static const String currentParentName = 'أحمد محمد علي';
  static const String currentSupervisorName = 'منى أحمد';
  static const String currentDriverName = 'خالد عبدالله';
  static const String currentTransportManagerName = 'مهندس عبدالسلام العمراني';

  static final List<StudentModel> students = [
    const StudentModel(
      id: 'std_01',
      name: 'محمد أحمد علي',
      grade: 'الصف الخامس',
      section: 'شعبة ب',
      schoolName: 'مدرسة المستقبل الأهلية',
      busNumber: '205',
      routeName: 'مسار حي الهدى',
      pickupPoint: 'حي الهدى - شارع السلام - محطة 3',
      dropoffPoint: 'مدرسة المستقبل الأهلية',
      parentName: currentParentName,
      parentPhone: '0501234567',
      subscriptionStatus: 'نشط',
      currentStatus: StudentTripStatus.boarded,
      avatarUrl: '',
    ),
    const StudentModel(
      id: 'std_02',
      name: 'سارة أحمد علي',
      grade: 'الصف الثالث',
      section: 'شعبة أ',
      schoolName: 'مدرسة المستقبل الأهلية',
      busNumber: '205',
      routeName: 'مسار حي الهدى',
      pickupPoint: 'حي الهدى - شارع السلام - محطة 3',
      dropoffPoint: 'مدرسة المستقبل الأهلية',
      parentName: currentParentName,
      parentPhone: '0501234567',
      subscriptionStatus: 'نشط',
      currentStatus: StudentTripStatus.waiting,
      avatarUrl: '',
    ),
    const StudentModel(
      id: 'std_03',
      name: 'عبدالله ناصر الشهري',
      grade: 'الصف الرابع',
      section: 'شعبة ج',
      schoolName: 'مدرسة المستقبل الأهلية',
      busNumber: '205',
      routeName: 'مسار حي الهدى',
      pickupPoint: 'حي الهدى - شارع النور',
      dropoffPoint: 'مدرسة المستقبل الأهلية',
      parentName: 'ناصر الشهري',
      parentPhone: '0559876543',
      subscriptionStatus: 'نشط',
      currentStatus: StudentTripStatus.waiting,
      avatarUrl: '',
    ),
    const StudentModel(
      id: 'std_04',
      name: 'ليان محمود الخالد',
      grade: 'الصف الخامس',
      section: 'شعبة أ',
      schoolName: 'مدرسة المستقبل الأهلية',
      busNumber: '205',
      routeName: 'مسار حي الهدى',
      pickupPoint: 'حي الهدى - شارع الأمل',
      dropoffPoint: 'مدرسة المستقبل الأهلية',
      parentName: 'محمود الخالد',
      parentPhone: '0541122334',
      subscriptionStatus: 'نشط',
      currentStatus: StudentTripStatus.absent,
      avatarUrl: '',
    ),
  ];

  static const BusModel activeBus = BusModel(
    id: 'bus_205',
    busNumber: '205',
    plateNumber: 'أ ب ج 14568',
    driverName: currentDriverName,
    driverPhone: '0507788990',
    supervisorName: currentSupervisorName,
    supervisorPhone: '0503344556',
    routeName: 'مسار حي الهدى',
    capacity: 35,
    currentStudentsCount: 24,
  );

  static const TripModel activeTrip = TripModel(
    id: 'trip_101',
    busNumber: '205',
    routeName: 'مسار حي الهدى',
    tripType: 'رحلة الصباح',
    status: TripStatus.inProgress,
    startTime: '06:45 ص',
    estimatedArrival: '07:30 ص',
    driverName: currentDriverName,
    supervisorName: currentSupervisorName,
    totalStudents: 24,
    boardedCount: 18,
    arrivedCount: 0,
    absentCount: 2,
  );

  static final List<AddressRequestModel> addressRequests = [
    const AddressRequestModel(
      id: 'req_01',
      studentName: 'محمد أحمد علي',
      currentAddress: 'حي الهدى - شارع السلام - مبنى 12',
      newAddress: 'حي النور - شارع الخليج - فيلا 45',
      type: AddressRequestType.permanent,
      reason: 'الانتقال إلى منزل جديد',
      startDate: '2026-08-10',
      nearestLandmark: 'مقابل مسجد التقوى',
      status: RequestStatus.underReview,
      schoolNotes: 'تم استلام الطلب وتجري مراجعة توازن المسارات',
    ),
    const AddressRequestModel(
      id: 'req_02',
      studentName: 'سارة أحمد علي',
      currentAddress: 'حي الهدى - شارع السلام - مبنى 12',
      newAddress: 'حي الروضة - شارع الملك فهد',
      type: AddressRequestType.temporary,
      reason: 'ظروف عائلية مؤقتة لدى بيت الجدة',
      startDate: '2026-08-05',
      endDate: '2026-08-15',
      nearestLandmark: 'بجوار حديقة الروضة',
      status: RequestStatus.approved,
      schoolNotes: 'تمت الموافقة وتعديل خط سير الحافلة مؤقتًا',
    ),
  ];

  static final List<AbsenceRequestModel> absenceRequests = [
    const AbsenceRequestModel(
      id: 'abs_01',
      studentName: 'محمد أحمد علي',
      type: 'رحلة العودة',
      startDate: '2026-08-02',
      reason: 'سيتم استلام الطالب من المدرسة بواسطة ولي الأمر',
      status: 'مقبول',
    ),
    const AbsenceRequestModel(
      id: 'abs_02',
      studentName: 'سارة أحمد علي',
      type: 'يوم كامل',
      startDate: '2026-08-05',
      endDate: '2026-08-06',
      reason: 'مراجعة طبية في المستشفى',
      status: 'قيد الانتظار',
    ),
  ];

  static final List<NotificationItemModel> notifications = [
    const NotificationItemModel(
      id: 'notif_01',
      title: 'صعد الطالب محمد الباص',
      body: 'تم تسجيل صعود محمد أحمد في حافلة 205 محطة حي الهدى',
      time: 'منذ 10 دقائق',
      category: 'رحلات',
      isRead: false,
    ),
    const NotificationItemModel(
      id: 'notif_02',
      title: 'اقتراب الحافلة',
      body: 'الحافلة رقم 205 على بعد 5 دقائق من محطة الوصول',
      time: 'منذ 25 دقيقة',
      category: 'رحلات',
      isRead: false,
    ),
    const NotificationItemModel(
      id: 'notif_03',
      title: 'تمت الموافقة على طلب تغيير العنوان',
      body: 'وافقت إدارة النقل على نقل سارة مؤقتًا لحي الروضة',
      time: 'أمس 04:30 م',
      category: 'عناوين',
      isRead: true,
    ),
  ];

  static final List<SyncOperationModel> syncOperations = [
    const SyncOperationModel(
      id: 'sync_9901',
      studentName: 'محمد أحمد علي',
      tripId: 'trip_101',
      actionType: 'صعد الباص',
      previousState: 'في الانتظار',
      newState: 'صعد الباص',
      timestamp: '07:05 ص',
      status: 'تمت المزامنة',
      retryCount: 0,
    ),
    const SyncOperationModel(
      id: 'sync_9902',
      studentName: 'عبدالله ناصر الشهري',
      tripId: 'trip_101',
      actionType: 'لم يحضر',
      previousState: 'في الانتظار',
      newState: 'لم يحضر',
      timestamp: '07:12 ص',
      status: 'بانتظار الإرسال',
      retryCount: 1,
      failureReason: 'ضعف شبكة الاتصال محليًا',
    ),
  ];

  static final List<DriverIncidentModel> driverIncidents = [
    const DriverIncidentModel(
      id: 'inc_01',
      type: 'تأخير بسبب الازدحام المروري',
      description: 'بطء الحركة في طريق الملك عبدالله بسبب أعمال الصيانة',
      timestamp: '07:15 ص',
      status: 'تم الإبلاغ',
    ),
  ];

  static final List<SupportTicketModel> supportTickets = [
    const SupportTicketModel(
      id: 'tkt_801',
      category: 'استفسارات النقل',
      subject: 'طلب تعديل وقت توقف الحافلة صباحًا',
      description: 'أرجو تقديم وقت التوقف بضع دقائق ليتناسب مع وقت الخروج',
      status: 'جاري المعالجة',
      createdAt: '2026-07-28',
    ),
  ];
}



// State Providers for dynamic demo interactions
final selectedRoleProvider = StateProvider<UserRole?>((ref) => null);
final selectedStudentIndexProvider = StateProvider<int>((ref) => 0);

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

final studentsListProvider = FutureProvider<List<StudentModel>>((ref) async {
  final api = ref.read(apiClientProvider);
  try {
    final response = await api.get('/students');
    final data = response['data'] as List?;
    if (data != null) {
      return data.map((e) => StudentModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return MockData.students;
  } catch (e) {
    return MockData.students;
  }
});

final activeTripProvider = FutureProvider<TripModel?>((ref) async {
  final tripService = ref.read(tripServiceProvider);
  return tripService.getActiveTrip();
});

final activeTripStudentsProvider = FutureProvider<List<StudentModel>>((ref) async {
  final trip = await ref.watch(activeTripProvider.future);
  if (trip == null) return [];
  final tripService = ref.read(tripServiceProvider);
  return tripService.getTripStudents(trip.id);
});

final scheduledTripsProvider = FutureProvider<List<TripModel>>((ref) async {
  final tripService = ref.read(tripServiceProvider);
  return tripService.getScheduledTrips();
});
final addressRequestsProvider = FutureProvider<List<AddressRequestModel>>((ref) async {
  final service = ref.read(requestsServiceProvider);
  return service.getAddressRequests();
});

final absenceRequestsProvider = FutureProvider<List<AbsenceRequestModel>>((ref) async {
  final service = ref.read(requestsServiceProvider);
  return service.getAbsenceRequests();
});

final syncOperationsProvider = FutureProvider<List<SyncOperationModel>>((ref) async {
  final service = ref.read(syncServiceProvider);
  final queue = await service.getQueue();
  
  return queue.map((op) => SyncOperationModel(
    id: op.id,
    studentName: op.studentName,
    tripId: op.tripId,
    actionType: 'تحديث حالة',
    previousState: '',
    newState: op.status,
    timestamp: op.timestamp.toString(),
    status: op.syncStatus == 'PENDING' ? 'بانتظار الإرسال' : (op.syncStatus == 'FAILED' ? 'فشل الإرسال' : 'تمت المزامنة'),
    retryCount: op.retryCount,
    failureReason: op.failureReason,
  )).toList();
});



final supportTicketsProvider = FutureProvider<List<SupportTicketModel>>((ref) async {
  final api = ref.read(apiClientProvider);
  try {
    final response = await api.get('/support/tickets');
    final data = response['data'] as List?;
    if (data != null) {
      return data.map((e) => SupportTicketModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return MockData.supportTickets;
  } catch (e) {
    return MockData.supportTickets;
  }
});

final notificationsProvider = FutureProvider<List<NotificationItemModel>>((ref) async {
  final api = ref.read(apiClientProvider);
  try {
    final response = await api.get('/notifications');
    final data = response['data'] as List?;
    if (data != null) {
      return data.map((e) => NotificationItemModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return MockData.notifications;
  } catch (e) {
    return MockData.notifications;
  }
});

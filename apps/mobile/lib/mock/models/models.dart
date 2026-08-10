enum UserRole {
  parent('ولي الأمر', 'parent'),
  supervisor('مشرفة الباص', 'supervisor'),
  driver('السائق', 'driver'),
  transportManager('مسؤول النقل', 'transport_manager');

  final String label;
  final String code;
  const UserRole(this.label, this.code);
}

enum StudentTripStatus {
  waiting('في الانتظار', 'orange'),
  boarded('صعد الباص', 'green'),
  arrived('وصل المدرسة', 'blue'),
  droppedOff('نزل من الباص', 'green'),
  absent('غائب', 'orange'),
  notPresent('لم يحضر', 'orange'),
  noReceiver('لم يوجد مستلم', 'red');

  final String label;
  final String colorType;
  const StudentTripStatus(this.label, this.colorType);
}

enum TripStatus {
  notStarted('لم تبدأ', 'gray'),
  inProgress('في الطريق', 'blue'),
  arrivedSchool('وصلت المدرسة', 'teal'),
  completed('مكتملة', 'green'),
  cancelled('ملغاة', 'red');

  final String label;
  final String colorType;
  const TripStatus(this.label, this.colorType);
}

enum AddressRequestType {
  permanent('دائم'),
  temporary('مؤقت'),
  pickupOnly('نقطة صعود فقط'),
  dropoffOnly('نقطة نزول فقط');

  final String label;
  const AddressRequestType(this.label);
}

enum RequestStatus {
  newReq('جديد'),
  underReview('قيد المراجعة'),
  approved('مقبول'),
  rejected('مرفوض'),
  needsEdit('يحتاج تعديل');

  final String label;
  const RequestStatus(this.label);
}

class StudentModel {
  final String id;
  final String name;
  final String grade;
  final String section;
  final String schoolName;
  final String busNumber;
  final String routeName;
  final String pickupPoint;
  final String dropoffPoint;
  final String parentName;
  final String parentPhone;
  final String subscriptionStatus;
  final StudentTripStatus currentStatus;
  final String avatarUrl;

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      grade: json['grade'] as String? ?? '',
      section: json['section'] as String? ?? '',
      schoolName: json['schoolName'] as String? ?? '',
      busNumber: json['busNumber'] as String? ?? '',
      routeName: json['routeName'] as String? ?? '',
      pickupPoint: json['pickupPoint'] as String? ?? '',
      dropoffPoint: json['dropoffPoint'] as String? ?? '',
      parentName: json['parentName'] as String? ?? '',
      parentPhone: json['parentPhone'] as String? ?? '',
      subscriptionStatus: json['subscriptionStatus'] as String? ?? '',
      currentStatus: StudentTripStatus.values.firstWhere((e) => e.name == json['currentStatus'] || e.toString() == json['currentStatus'], orElse: () => StudentTripStatus.waiting),
      avatarUrl: json['avatarUrl'] as String? ?? '',
    );
  }

  const StudentModel({
    required this.id,
    required this.name,
    required this.grade,
    required this.section,
    required this.schoolName,
    required this.busNumber,
    required this.routeName,
    required this.pickupPoint,
    required this.dropoffPoint,
    required this.parentName,
    required this.parentPhone,
    required this.subscriptionStatus,
    required this.currentStatus,
    required this.avatarUrl,
  });

  StudentModel copyWith({StudentTripStatus? currentStatus}) {
    return StudentModel(
      id: id,
      name: name,
      grade: grade,
      section: section,
      schoolName: schoolName,
      busNumber: busNumber,
      routeName: routeName,
      pickupPoint: pickupPoint,
      dropoffPoint: dropoffPoint,
      parentName: parentName,
      parentPhone: parentPhone,
      subscriptionStatus: subscriptionStatus,
      currentStatus: currentStatus ?? this.currentStatus,
      avatarUrl: avatarUrl,
    );
  }
}

class BusModel {
  final String id;
  final String busNumber;
  final String plateNumber;
  final String driverName;
  final String driverPhone;
  final String supervisorName;
  final String supervisorPhone;
  final String routeName;
  final int capacity;
  final int currentStudentsCount;

  factory BusModel.fromJson(Map<String, dynamic> json) {
    return BusModel(
      id: json['id'] as String? ?? '',
      busNumber: json['busNumber'] as String? ?? '',
      plateNumber: json['plateNumber'] as String? ?? '',
      driverName: json['driverName'] as String? ?? '',
      driverPhone: json['driverPhone'] as String? ?? '',
      supervisorName: json['supervisorName'] as String? ?? '',
      supervisorPhone: json['supervisorPhone'] as String? ?? '',
      routeName: json['routeName'] as String? ?? '',
      capacity: json['capacity'] as int? ?? 0,
      currentStudentsCount: json['currentStudentsCount'] as int? ?? 0,
    );
  }

  const BusModel({
    required this.id,
    required this.busNumber,
    required this.plateNumber,
    required this.driverName,
    required this.driverPhone,
    required this.supervisorName,
    required this.supervisorPhone,
    required this.routeName,
    required this.capacity,
    required this.currentStudentsCount,
  });
}

class TripModel {
  final String id;
  final String busNumber;
  final String routeName;
  final String tripType; // صباحية / عودة
  final TripStatus status;
  final String startTime;
  final String estimatedArrival;
  final String driverName;
  final String supervisorName;
  final int totalStudents;
  final int boardedCount;
  final int arrivedCount;
  final int absentCount;

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      id: json['id'] as String? ?? '',
      busNumber: json['busNumber'] as String? ?? '',
      routeName: json['routeName'] as String? ?? '',
      tripType: json['tripType'] as String? ?? '',
      status: TripStatus.values.firstWhere((e) => e.name == json['status'] || e.toString() == json['status'], orElse: () => TripStatus.notStarted),
      startTime: json['startTime'] as String? ?? '',
      estimatedArrival: json['estimatedArrival'] as String? ?? '',
      driverName: json['driverName'] as String? ?? '',
      supervisorName: json['supervisorName'] as String? ?? '',
      totalStudents: json['totalStudents'] as int? ?? 0,
      boardedCount: json['boardedCount'] as int? ?? 0,
      arrivedCount: json['arrivedCount'] as int? ?? 0,
      absentCount: json['absentCount'] as int? ?? 0,
    );
  }

  const TripModel({
    required this.id,
    required this.busNumber,
    required this.routeName,
    required this.tripType,
    required this.status,
    required this.startTime,
    required this.estimatedArrival,
    required this.driverName,
    required this.supervisorName,
    required this.totalStudents,
    required this.boardedCount,
    required this.arrivedCount,
    required this.absentCount,
  });

  TripModel copyWith({
    String? id,
    String? busNumber,
    String? routeName,
    String? tripType,
    TripStatus? status,
    String? startTime,
    String? estimatedArrival,
    String? driverName,
    String? supervisorName,
    int? totalStudents,
    int? boardedCount,
    int? arrivedCount,
    int? absentCount,
  }) {
    return TripModel(
      id: id ?? this.id,
      busNumber: busNumber ?? this.busNumber,
      routeName: routeName ?? this.routeName,
      tripType: tripType ?? this.tripType,
      status: status ?? this.status,
      startTime: startTime ?? this.startTime,
      estimatedArrival: estimatedArrival ?? this.estimatedArrival,
      driverName: driverName ?? this.driverName,
      supervisorName: supervisorName ?? this.supervisorName,
      totalStudents: totalStudents ?? this.totalStudents,
      boardedCount: boardedCount ?? this.boardedCount,
      arrivedCount: arrivedCount ?? this.arrivedCount,
      absentCount: absentCount ?? this.absentCount,
    );
  }
}

class AddressRequestModel {
  final String id;
  final String studentName;
  final String currentAddress;
  final String newAddress;
  final AddressRequestType type;
  final String reason;
  final String startDate;
  final String? endDate;
  final String nearestLandmark;
  final RequestStatus status;
  final String schoolNotes;

  factory AddressRequestModel.fromJson(Map<String, dynamic> json) {
    return AddressRequestModel(
      id: json['id'] as String? ?? '',
      studentName: json['studentName'] as String? ?? '',
      currentAddress: json['currentAddress'] as String? ?? '',
      newAddress: json['newAddress'] as String? ?? '',
      type: AddressRequestType.values.firstWhere((e) => e.name == json['type'] || e.toString() == json['type'], orElse: () => AddressRequestType.permanent),
      reason: json['reason'] as String? ?? '',
      startDate: json['startDate'] as String? ?? '',
      endDate: json['endDate'] as String?,
      nearestLandmark: json['nearestLandmark'] as String? ?? '',
      status: RequestStatus.values.firstWhere((e) => e.name == json['status'] || e.toString() == json['status'], orElse: () => RequestStatus.newReq),
      schoolNotes: json['schoolNotes'] as String? ?? '',
    );
  }

  const AddressRequestModel({
    required this.id,
    required this.studentName,
    required this.currentAddress,
    required this.newAddress,
    required this.type,
    required this.reason,
    required this.startDate,
    this.endDate,
    required this.nearestLandmark,
    required this.status,
    required this.schoolNotes,
  });
}

class AbsenceRequestModel {
  final String id;
  final String studentName;
  final String type; // صباح / عودة / يوم كامل / عدة أيام
  final String startDate;
  final String? endDate;
  final String reason;
  final String status;

  factory AbsenceRequestModel.fromJson(Map<String, dynamic> json) {
    return AbsenceRequestModel(
      id: json['id'] as String? ?? '',
      studentName: json['studentName'] as String? ?? '',
      type: json['type'] as String? ?? '',
      startDate: json['startDate'] as String? ?? '',
      endDate: json['endDate'] as String?,
      reason: json['reason'] as String? ?? '',
      status: json['status'] as String? ?? '',
    );
  }

  const AbsenceRequestModel({
    required this.id,
    required this.studentName,
    required this.type,
    required this.startDate,
    this.endDate,
    required this.reason,
    required this.status,
  });
}

class NotificationItemModel {
  final String id;
  final String title;
  final String body;
  final String time;
  final String category;
  final bool isRead;

  factory NotificationItemModel.fromJson(Map<String, dynamic> json) {
    return NotificationItemModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      body: json['body'] as String? ?? '',
      time: json['time'] as String? ?? '',
      category: json['category'] as String? ?? '',
      isRead: json['isRead'] as bool? ?? false,
    );
  }

  const NotificationItemModel({
    required this.id,
    required this.title,
    required this.body,
    required this.time,
    required this.category,
    required this.isRead,
  });
}

class SyncOperationModel {
  final String id;
  final String studentName;
  final String tripId;
  final String actionType;
  final String previousState;
  final String newState;
  final String timestamp;
  final String status;
  final int retryCount;
  final String? failureReason;

  factory SyncOperationModel.fromJson(Map<String, dynamic> json) {
    return SyncOperationModel(
      id: json['id'] as String? ?? '',
      studentName: json['studentName'] as String? ?? '',
      tripId: json['tripId'] as String? ?? '',
      actionType: json['actionType'] as String? ?? '',
      previousState: json['previousState'] as String? ?? '',
      newState: json['newState'] as String? ?? '',
      timestamp: json['timestamp'] as String? ?? '',
      status: json['status'] as String? ?? '',
      retryCount: json['retryCount'] as int? ?? 0,
      failureReason: json['failureReason'] as String?,
    );
  }

  const SyncOperationModel({
    required this.id,
    required this.studentName,
    required this.tripId,
    required this.actionType,
    required this.previousState,
    required this.newState,
    required this.timestamp,
    required this.status,
    required this.retryCount,
    this.failureReason,
  });
}

class DriverIncidentModel {
  final String id;
  final String type;
  final String description;
  final String timestamp;
  final String status;

  factory DriverIncidentModel.fromJson(Map<String, dynamic> json) {
    return DriverIncidentModel(
      id: json['id'] as String? ?? '',
      type: json['type'] as String? ?? '',
      description: json['description'] as String? ?? '',
      timestamp: json['timestamp'] as String? ?? '',
      status: json['status'] as String? ?? '',
    );
  }

  const DriverIncidentModel({
    required this.id,
    required this.type,
    required this.description,
    required this.timestamp,
    required this.status,
  });
}

class SupportTicketModel {
  final String id;
  final String category;
  final String subject;
  final String description;
  final String status;
  final String createdAt;

  factory SupportTicketModel.fromJson(Map<String, dynamic> json) {
    return SupportTicketModel(
      id: json['id'] as String? ?? '',
      category: json['category'] as String? ?? '',
      subject: json['subject'] as String? ?? '',
      description: json['description'] as String? ?? '',
      status: json['status'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
    );
  }

  const SupportTicketModel({
    required this.id,
    required this.category,
    required this.subject,
    required this.description,
    required this.status,
    required this.createdAt,
  });
}

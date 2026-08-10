export interface Student {
  id: string;
  name: string;
  code: string;
  grade: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  busNumber: string;
  routeName: string;
  pickupPoint: string;
  dropoffPoint: string;
  status: "نشط" | "غائب" | "موقوف";
  subscriptionStatus: "مدفوع" | "مستحق" | "متأخر";
  locationVerified: boolean;
  avatar?: string;
  notes?: string;
}

export interface Bus {
  id: string;
  number: string;
  plateNumber: string;
  type: string;
  capacity: number;
  assignedStudentsCount: number;
  driverName: string;
  driverPhone: string;
  supervisorName: string;
  supervisorPhone: string;
  routeName: string;
  status: "نشط" | "في الصيانة" | "متوقف";
  lastSyncTime: string;
}

export interface Route {
  id: string;
  name: string;
  type: "صباحي" | "مسائي" | "مزدوج";
  zone: string;
  busNumber: string;
  studentsCount: number;
  estimatedTimeMinutes: number;
  distanceKm: number;
  stopsCount: number;
  status: "نشط" | "قيد التعديل";
}

export interface Trip {
  id: string;
  tripNumber: string;
  busNumber: string;
  routeName: string;
  type: "رحلة الصباح" | "رحلة العودة";
  driverName: string;
  supervisorName: string;
  date: string;
  startTime: string;
  endTime?: string;
  expectedStudents: number;
  boardedStudents: number;
  absentStudents: number;
  arrivedStudents: number;
  status: "جارية" | "مكتملة" | "متأخرة" | "لم تبدأ";
}

export interface AddressRequest {
  id: string;
  studentName: string;
  studentGrade: string;
  guardianName: string;
  guardianPhone: string;
  requestType: "دائم" | "مؤقت";
  oldAddress: string;
  newAddress: string;
  distanceDeltaKm: number;
  currentBus: string;
  proposedBus: string;
  requestDate: string;
  effectiveDate: string;
  status: "قيد المراجعة" | "مقبول" | "مرفوض";
  reason: string;
}

export interface AbsenceRequest {
  id: string;
  studentName: string;
  studentGrade: string;
  guardianName: string;
  guardianPhone: string;
  busNumber: string;
  absenceType: "رحلة الصباح" | "رحلة العودة" | "يوم كامل" | "عدة أيام";
  startDate: string;
  endDate: string;
  personalPickup: boolean;
  reason: string;
  status: "معتمد" | "قيد الانتظار" | "مرفوض";
  submittedAt: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  studentName: string;
  guardianName: string;
  amount: number;
  discount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: "تحويل بنكي" | "بطاقة مدي" | "نقدي";
  paymentDate: string;
  status: "مكتمل" | "جزئي" | "قيد التحصيل";
  collectedBy: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  targetGroup: "جميع أولياء الأمور" | "سائقي الحافلات" | "المشرفات" | "طاقم الإدارة";
  sentAt: string;
  status: "تم الإرسال" | "مجدول" | "مسودة";
  readCount: number;
  totalRecipients: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: "أعطال الـ GPS" | "استفسارات الفواتير" | "إضافة حافلات جديدة" | "دعم فني عام";
  subject: string;
  description: string;
  priority: "عالية" | "متوسطة" | "عادية";
  status: "قيد المعالجة" | "مفتوحة" | "مغلقة";
  createdAt: string;
  lastReply: string;
}

export const mockSchoolInfo = {
  name: "مدارس المستقبل الأهلية",
  code: "SCH-9082",
  city: "الرياض",
  district: "حي الياسمين",
  phone: "0114567890",
  email: "info@almustaqbal.edu.sa",
  activeStudents: 480,
  activeBuses: 18,
  activeRoutes: 14,
  subscriptionPlan: "الباقة المتقدمة (Professional)",
  subscriptionExpires: "2026-12-31",
  syncStatus: "متصل بالكامل",
};

export const mockStudents: Student[] = [];
export const mockBuses: Bus[] = [];
export const mockRoutes: Route[] = [];
export const mockTrips: Trip[] = [];
export const mockAddressRequests: AddressRequest[] = [];
export const mockAbsenceRequests: AbsenceRequest[] = [];
export const mockPayments: PaymentReceipt[] = [];
export const mockNotifications: NotificationItem[] = [];
export const mockSupportTickets: SupportTicket[] = [];

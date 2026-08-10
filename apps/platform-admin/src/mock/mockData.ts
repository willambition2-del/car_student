export interface SchoolTenant {
  id: string;
  name: string;
  code: string;
  city: string;
  managerName: string;
  managerPhone: string;
  email: string;
  planName: string;
  status: "نشطة" | "تجربة مجانية" | "متوقفة" | "انتهى الاشتراك";
  studentsCount: number;
  busesCount: number;
  subscriptionEndDate: string;
  monthlyRevenue: number;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  maxStudents: number;
  maxBuses: number;
  maxUsers: number;
  features: string[];
  activeSubscribersCount: number;
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  schoolName: string;
  planName: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: "نشط" | "تنتهي قريبًا" | "منتهي";
  autoRenew: boolean;
}

export interface PlatformInvoice {
  id: string;
  invoiceNumber: string;
  schoolName: string;
  planName: string;
  amount: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: "مدفوعة" | "مستحقة" | "متأخرة";
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabledGlobal: boolean;
  plansAllowed: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  schoolName?: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export const mockPlatformOverview = {
  totalSchools: 24,
  activeSchools: 18,
  trialSchools: 4,
  suspendedSchools: 2,
  totalStudents: 14200,
  totalBuses: 580,
  monthlyRecurringRevenue: 284000,
  expiringSubscriptions: 3,
  systemHealth: "ممتاز 99.98%",
};

export const mockSchools: SchoolTenant[] = [
  {
    id: "sch-101",
    name: "مدارس المستقبل الأهلية",
    code: "SCH-9082",
    city: "الرياض",
    managerName: "أحمد المحمد",
    managerPhone: "0501122334",
    email: "info@almustaqbal.edu.sa",
    planName: "الاحترافية (Professional)",
    status: "نشطة",
    studentsCount: 480,
    busesCount: 18,
    subscriptionEndDate: "2026-12-31",
    monthlyRevenue: 12000,
  },
  {
    id: "sch-102",
    name: "مدارس الإبداع الحديثة",
    code: "SCH-7712",
    city: "جدة",
    managerName: "سليمان العتيبي",
    managerPhone: "0559988776",
    email: "admin@alebda.edu.sa",
    planName: "المتقدمة (Advanced)",
    status: "تجربة مجانية",
    studentsCount: 220,
    busesCount: 8,
    subscriptionEndDate: "2026-08-15",
    monthlyRevenue: 0,
  },
  {
    id: "sch-103",
    name: "مدرسة الرواد النموذجية",
    code: "SCH-4401",
    city: "الدمام",
    managerName: "فهد الدوسري",
    managerPhone: "0543322110",
    email: "contact@alrowad.edu.sa",
    planName: "الأساسية (Basic)",
    status: "متوقفة",
    studentsCount: 110,
    busesCount: 4,
    subscriptionEndDate: "2026-06-30",
    monthlyRevenue: 4500,
  },
];

export const mockPlans: Plan[] = [
  {
    id: "plan-basic",
    name: "الأساسية (Basic)",
    priceMonthly: 1500,
    priceAnnual: 15000,
    maxStudents: 150,
    maxBuses: 5,
    maxUsers: 3,
    features: ["توزيع الطلاب المتقدم", "إشعارات أولياء الأمور", "تقارير الحضور"],
    activeSubscribersCount: 6,
  },
  {
    id: "plan-pro",
    name: "الاحترافية (Professional)",
    priceMonthly: 3500,
    priceAnnual: 35000,
    maxStudents: 500,
    maxBuses: 20,
    maxUsers: 10,
    features: ["مزامنة بدون إنترنت (Offline Sync)", "طلبات تغيير العنوان والغياب", "دعم فني على مدار الساعة"],
    activeSubscribersCount: 14,
    isPopular: true,
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub-101",
    schoolName: "مدارس المستقبل الأهلية",
    planName: "الاحترافية (Professional)",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    amount: 35000,
    status: "نشط",
    autoRenew: true,
  },
  {
    id: "sub-102",
    schoolName: "مدارس الإبداع الحديثة",
    planName: "المتقدمة (Advanced)",
    startDate: "2026-07-15",
    endDate: "2026-08-15",
    amount: 0,
    status: "تنتهي قريبًا",
    autoRenew: false,
  },
];

export const mockInvoices: PlatformInvoice[] = [
  {
    id: "inv-901",
    invoiceNumber: "INV-2026-0142",
    schoolName: "مدارس المستقبل الأهلية",
    planName: "الاحترافية (Professional)",
    amount: 35000,
    tax: 5250,
    total: 40250,
    issueDate: "2026-01-01",
    dueDate: "2026-01-15",
    status: "مدفوعة",
  },
];

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: "ff-1",
    key: "advanced_routing",
    name: "تخطيط المسارات المتقدم",
    description: "أدوات لتخطيط وتوزيع المسارات تلقائياً",
    enabledGlobal: true,
    plansAllowed: ["المتقدمة", "الاحترافية"],
  },
  {
    id: "ff-2",
    key: "offline_sync_queue",
    name: "المزامنة الميدانية بدون اتصال (Offline Sync)",
    description: "حفظ عمليات المشرفة محلياً في حالة انقطاع التغطية الأفقية",
    enabledGlobal: true,
    plansAllowed: ["الاحترافية"],
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    action: "تعديل حدود باقة اشتراك",
    user: "سليمان المنصور (مالك المنصة)",
    schoolName: "مدارس المستقبل الأهلية",
    timestamp: "2026-08-01 11:15",
    ipAddress: "197.230.14.88",
    details: "زيادة السعة القصوى للحافلات من 15 إلى 20 حافلة.",
  },
];

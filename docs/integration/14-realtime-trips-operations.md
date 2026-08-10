# تقرير المرحلة الحادية عشرة: الرحلات اليومية والعمليات والغياب (Real-Time Trips, Operations & Absence Integration)

> **تاريخ الإنجاز:** 2026-08-01
> **الحالة:** ✅ مكتمل ومختبر 100%

---

## 1. الوحدات والـ Endpoints المنفذة في الـ Backend (`src/trips/` & `src/absence-requests/`)

### وحدة الرحلات الميدانية والعمليات (`src/trips/`):
- `GET /api/v1/school/trips`: استعلام الرحلات الميدانية بتصفيات الحالة والحافلة والمسار والسائق والمشرفة وتاريخ اليوم.
- `GET /api/v1/school/trips/:id`: تفاصيل الرحلة وقائمة حضور الطلاب الميدانية وسجل إحداثيات الـ GPS والأحداث.
- `POST /api/v1/school/trips/start`: بدء رحلة جديدة للمسار واستخراج قائمة الطلاب تلقائياً وحالتهم `WAITING`.
- `POST /api/v1/school/trips/:id/student-status`: تسجيل حالة صعود/نزول/غياب الطالب في الرحلة.
- `POST /api/v1/school/trips/:id/complete`: إنهاء الرحلة وحساب التوقيت الفعلي للحافلة وإغلاق الملف.

### وحدة طلبات غياب الطلاب (`src/absence-requests/`):
- `GET /api/v1/school/absence-requests`: استعلام طلبات غياب الطلاب المقدمة مسبقاً عبر تطبيق ولي الأمر.
- `GET /api/v1/school/absence-requests/:id`: تفاصيل طلب الغياب والسبب والتاريخ.
- `POST /api/v1/school/absence-requests`: تقديم طلب غياب جديد.
- `POST /api/v1/school/absence-requests/:id/approve`: اعتماد طلب الغياب -> توثيق الإشعار آلياً لقائمة الرحلة.
- `POST /api/v1/school/absence-requests/:id/reject`: رفض طلب الغياب وتوثيق السبب.

---

## 2. التكامل مع لوحة تحكم المدرسة (School Dashboard Web App)

- **`src/lib/api.ts`**: إضافة `schoolTripsApi` و `schoolAbsenceRequestsApi`.
- **صفحة سجل الرحلات (`/trips`)**: تم الربط المباشر مع `schoolTripsApi.getTrips()` وعرض الرحلات الحية وسجل الصعود والغياب.
- **صفحة طلبات الغياب (`/absence-requests`)**: تم الربط المباشر مع `schoolAbsenceRequestsApi.getRequests()` وعرض حالة إخطارات الغياب حياً.

---

## 3. نتائج البناء والاختبارات

- **Backend Build**: `npm run build` -> ✅ 0 errors
- **Backend Tests**: `npm run test` -> ✅ 3 test suites passed (5 tests)
- **School Dashboard Build**: `npm run build` -> ✅ 0 errors (تم توليد 34 صفحة سكونية)
- **API Runtime Test**: تم اختبار طلب `GET /api/v1/school/trips` و `GET /api/v1/school/absence-requests` وتلقي استجابة حقيقية بـ 200 OK للرحلات التجريبية المسجلة.

# دليل الإعداد لبيئة الـ Staging ومتغيرات البيئة

## ملخص المتغيرات المطلوبة لكل نظام

### 1. Backend (`apps/backend/.env`)
الـ Backend يعتمد على ملف `.env` لقراءة خصائص قاعدة البيانات وأسرار الـ JWT:
- `PORT` = منفذ التشغيل (افتراضي 3000)
- `NODE_ENV` / `APP_ENV` = `staging`
- `DATABASE_URL` = رابط قاعدة بيانات PostgreSQL لبيئة Staging.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` = مفاتيح التشفير للـ Staging.
- `CORS_ORIGINS` = روابط لوحات التحكم الأمامية (Staging).

> [!WARNING]
> لا تقم باستخدام `DATABASE_URL` الخاص بالـ Production في الـ Staging.

### 2. School Dashboard & Platform Admin
تعتمد لوحات التحكم المبنية بـ Next.js على المتغيرات التالية:
- `NEXT_PUBLIC_API_URL` = رابط الـ API للـ Backend في الـ Staging (مثلاً `https://api-staging.domain.com/api/v1`).
يجب ضبط هذا المتغير في Vercel أو Coolify أثناء عملية الـ Build.

### 3. تطبيق Flutter (Mobile App)
في بيئة الـ Staging، لا نستخدم روابط صلبة `Hardcoded`، بل نقوم بحقن المتغير عبر `--dart-define`:
```bash
flutter build apk --release --dart-define=API_BASE_URL=https://api-staging.domain.com/api/v1 --dart-define=APP_ENV=staging
```
يقرأ الـ `ApiClient` هذا المتغير في `lib/core/network/api_client.dart` ويوجهه لكل الخدمات.

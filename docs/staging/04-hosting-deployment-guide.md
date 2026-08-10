# الدليل الشامل لرفع بيئة الاستضافة (Staging Deployment)

## 1. استخدام Coolify أو Docker Compose
المنصة مصممة للعمل بكفاءة عبر `Docker`. لقد قمنا بإنشاء وتجهيز `Dockerfile` للـ Backend و Next.js.
للـ Staging، نستخدم بيئة معزولة تحتوي على:
- `NestJS Backend Container`
- `PostgreSQL 16 Container`
- `Redis 7 Container`

### ملف `docker-compose.staging.yml` المقترح للرفع
```yaml
version: '3.8'
services:
  api:
    build: 
      context: ./apps/backend
    ports:
      - '3000:3000'
    env_file:
      - ./apps/backend/.env.staging
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: staging_user
      POSTGRES_PASSWORD: staging_pass
      POSTGRES_DB: school_transport_staging
    volumes:
      - db-staging-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis-staging-data:/data

volumes:
  db-staging-data:
  redis-staging-data:
```

## 2. النشر الآلي عبر Coolify (مستحسن)
1. قم بربط مستودع الـ GitHub بـ Coolify.
2. أضف مورد جديد من نوع `Docker Compose`.
3. ألصق محتوى `docker-compose.staging.yml`.
4. أضف متغيرات البيئة السرية مباشرة في واجهة Coolify البيئية.
5. اربط الـ Domains (مثل `api-staging.example.com` للـ Backend).

## 3. رفع الـ Next.js Dashboards
يُفضل رفع `school-dashboard` و `platform-admin` باستخدام `Vercel` أو كـ `Static Site` / `Node App` منفصل على Coolify.
- تأكد من حقن المتغير السري `NEXT_PUBLIC_API_URL` برابط الـ API الذي استخرجته في الخطوة السابقة.

## 4. تحديث الـ Database Schema
عند كل عملية رفع (Deploy)، تأكد من تشغيل أمر التحديث لقاعدة البيانات:
```bash
npx prisma migrate deploy
```
هذا يضمن تطابق بنية قاعدة بيانات Staging مع آخر التعديلات.

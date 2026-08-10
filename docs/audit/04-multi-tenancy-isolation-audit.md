# تدقيق العزل بين المدارس

schoolId مصدره JWT، ومستخدم المنصة مرفوض في SchoolContextGuard. تم التحقق من تبعية الطالب والمحطة والسائق والمشرفة والحافلة والرسوم للمدرسة، ومنع تغيير schoolId/deletedAt عبر حقول تحديث صريحة.

اختبارات guards وRoutesService تثبت حالات cross-tenant أساسية. لا تزال Socket/GPS وParent/Driver غير قابلة للإثبات، وكل findUnique جديد يحتاج scoped repository واختبار مدرستين.

# توثيق نظام التصميم البصري الجديد لتطبيق Flutter

## 1. فلسفة التصميم (Design Philosophy)
تم بناء نظام التصميم البصري ليعكس الهوية المؤسسية الرسمية لمنصات إدارة النقل المدرسي الذكي:
- **نظيف وهادئ (Minimal & Clean)**: اعتماد خلفيات متناسقة وسحب الحواف الحادة.
- **تدرج هرمي واضح (Visual Hierarchy)**: استخدام أحجام وأوزان خطوط Cairo المحددة بدقة لتوجيه عين المستخدم نحو الإجراء المطلوب.
- **لا تدرجات لونية طفولية (No Gimmicks)**: التخلص التام من التدرجات القوية والعناصر الاستعراضية، والاستعاضة عنها بألوان كحيل وأزرق مؤسسي هادئ.

## 2. لوحة الألوان المعتمدة (Color System)
- **Deep Corporate Navy (`#123B5D`)**: اللون الرئيسي لشريط التنقل، العناوين، والأزرار الأساسية.
- **Primary Navy Soft (`#EBF3FA`)**: خلفية التمييز والحقول المضيئة.
- **Background (`#F7F8FA`)**: الخلفية العامة للشاشات لتوفير راحة بصرية.
- **Surface (`#FFFFFF`)**: خلفية البطاقات والحاويات المحددة بحدود.
- **Border (`#E2E8F0`)**: حدود دقيقة وخفيفة 1px بدلاً من الظلال البارزة.
- **Status Colors**:
  - أخضر النجاح (`#16A34A` / Soft: `#DCFCE7`)
  - برتقالي التنبيه (`#D97706` / Soft: `#FEF3C7`)
  - أحمر الطوارئ (`#DC2626` / Soft: `#FEE2E2`)

## 3. الخطوط والطباعة العربية (Typography & RTL)
- دعم لغة عربية أولية (Arabic RTL First).
- استخدام خط Cairo من مكتبة `google_fonts` مع أحجام محددة:
  - Display: 28px Bold
  - Headline Large: 20px-22px Bold
  - Title Large: 18px SemiBold
  - Title Medium: 15px SemiBold
  - Title Small: 13px Medium
  - Body Medium: 14px Regular
  - Body Small / Caption: 11px-12px Regular (Muted Text `#64748B`)

## 4. الحواف والحدود (Border Radius Scale)
- `borderSm`: 6px
- `borderMd`: 8px
- `borderLg`: 12px
- `borderXl`: 14px
- `borderFull`: 999px (للشارات والأشعار الدائرية)

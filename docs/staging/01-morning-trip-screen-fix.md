# تقرير إصلاح الشاشة المعلقة (تنفيذ الرحلة الصباحية)

## وصف المشكلة
عند دخول المشرفة إلى شاشة "تنفيذ الرحلة الميدانية"، يظهر شريط الإحصائيات العلوي وشريط التنقل السفلي، لكن المحتوى الرئيسي (قائمة الطلاب) يختفي تمامًا ويبدو التطبيق كأنه "معلق" أو لا يستجيب، ولا يعرض أي رسالة خطأ صريحة للمستخدم.

## السبب الجذري (Root Cause)
بعد تحليل `supervisor_active_trip_screen.dart` واختبار الشاشة باستخدام `flutter test`، تبين أن المشكلة ليست في الـ Provider أو استدعاء الـ API أو وجود Loop لا نهائي.
المشكلة كانت **عطلًا في تخطيط العرض (RenderFlex Exception)** بسبب القيود اللانهائية للوحة الرسم (Infinite Width Constraints).

في Flutter، عندما يتم وضع عنصر يطلب عرضًا لانهائيًا (`width: double.infinity`) داخل عنصر من نوع `Row` بدون استخدام `Expanded` أو `Flexible`، يفشل محرك العرض في حساب المساحة المتاحة ويتوقف عن رسم باقي المحتوى صامتًا (إذا تم تجاوز الاستثناء في وضع الإصدار)، مما يعطي انطباعًا بأن التطبيق معلق.

العنصر المسبب للمشكلة كان:
```dart
OutlineButton(
  text: 'تأكيد الوصول للمدرسة',
  height: 36,
  ...
)
```
بالإضافة إلى الأزرار `PrimaryButton` و `DangerButton` داخل عناصر قائمة الطلاب. كانت هذه الأزرار (في `app_buttons.dart`) تُجبر عرضها على أن يكون `double.infinity` افتراضيًا.

## الملفات التي تم تعديلها
1. **`lib/core/widgets/app_buttons.dart`**
   - إضافة المعامل `width` للأزرار `PrimaryButton`، `SecondaryButton`، `OutlineButton`، و `DangerButton`.
   - جعل القيمة الافتراضية `double.infinity` للحفاظ على توافقية التصميم في باقي التطبيق، مع السماح بتمرير `width: null` لجعل الزر يتكيف مع حجم النص داخله.

2. **`lib/features/supervisor/supervisor_active_trip_screen.dart`**
   - تمرير `width: null` إلى جميع الأزرار الموجودة داخل `Row` (`OutlineButton` بجانب عنوان القائمة، و `PrimaryButton` / `DangerButton` داخل كل عنصر في قائمة الطلاب).

## نتيجة اختبار الـ Android / Widget Test
تم إجراء اختبار آلي لتركيب شاشة `SupervisorActiveTripScreen` (عبر `supervisor_trip_test.dart`). 
- **النتيجة قبل الإصلاح:** `BoxConstraints forces an infinite width. The offending constraints were: BoxConstraints(w=Infinity, h=36.0)`
- **النتيجة بعد الإصلاح:** `All tests passed!` (تم عرض الشاشة بالكامل بدون أي استثناءات).

الشاشة الآن تعمل بسلاسة، تعرض قائمة الطلاب بشكل فوري، وتسمح بالتفاعل مع أزرار (صعد، غائب، النزول).

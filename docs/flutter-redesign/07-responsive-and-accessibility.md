# التجاوب مع مختلف الشاشات وسهولة الاستخدام (Responsive & Accessibility)

## 1. التجاوب مع أحجام الشاشات المختلفة
- تم الاعتماد على `ResponsiveLayout` لتقديم تصميم متكيف تلقائيًا بين الشاشات الصغيرة (أقل من 360dp) والشاشات المتوسطة والكبيرة.
- استخدام `SingleChildScrollView` مع `BouncingScrollPhysics` لمنع أي خطأ تجاوز في أبعاد الشاشة (Overflow/Yellow Strip errors).

## 2. سهولة الاستخدام للميدان (Field Usability & Motion Stability)
- تصميم أزرار الإجراءات الميدانية للمشرفة والسائق بارتفاع 48px - 50px ومساحات لمس واسعة (Minimum Touch Target 48dp) لضمان سهولة الاستخدام أثناء اهتزاز الحافلة.
- دعم كامل لاتجاه القراءة من اليمين إلى اليسار (Arabic RTL Directionality).
- ألوان عالية التباين (Contrast Ratios) تتوافق مع معايير WCAG 2.1 بين النصوص والخلفيات.

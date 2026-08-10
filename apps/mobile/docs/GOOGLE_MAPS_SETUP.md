# دليل إعداد Google Maps API لتطبيق الموبايل

## 1. الحصول على مفتاح API (Google Maps API Key)
1. انتقل إلى منصة [Google Cloud Console](https://console.cloud.google.com/).
2. أنشئ مشروعًا جديدًا أو اختر مشروعًا قائمًا.
3. فعّل الخدمات التالية:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
4. أنشئ مفتاح API جديد من قسم **Credentials**.

## 2. إعداد منصة Android
افتح الملف: `android/app/src/main/AndroidManifest.xml`
أضف السطر التالي داخل عنصر `<application>`:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_REAL_GOOGLE_MAPS_API_KEY_HERE" />
```

## 3. إعداد منصة iOS
افتح الملف: `ios/Runner/AppDelegate.swift`
أضف استدعاء مفتاح الخريطة:

```swift
import UIKit
import Flutter
import GoogleMaps

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) {
    GMSServices.provideAPIKey("YOUR_REAL_GOOGLE_MAPS_API_KEY_HERE")
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

## 4. الخيار البديل التفاعلي في وضع التطوير (Development Fallback)
في حال عدم إضافة مفتاح API حقيقي في بيئة التطوير المحلية، يعرض التطبيق تلقائيًا المكون التفاعلي `MapPlaceholder` المحسّن بوضوح مع شبكة مسارات تفاعلية وعلامات الحافلات والطلاب والمدرسة دون التسبب بانهيار التطبيق أو ظهور خطأ شاشة رمادية.

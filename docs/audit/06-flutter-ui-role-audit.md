# تدقيق Flutter والأدوار

أضيف redirect للمصادقة والدور، ومنع مسارات الدور الآخر، وتجديد single-flight وretry واحد ومسح الجلسة وsame-origin Authorization وHTTPS Release.

flutter analyze: 22 info فقط. flutter test: 1/1. APK debug: ناجح.

المفتوح: MockRepository واسع، استعادة كلمة المرور غير موصولة، ولا اختبارات routing/interceptor/offline. يلزم 403 screen وتعطيل role switcher خارج التطوير المحلي.

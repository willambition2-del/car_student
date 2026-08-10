# تدقيق المصادقة

تم فرض سرين JWT مختلفين بطول 32 مع issuer وaudience وHS256 بلا fallback. أصبح refresh ذريًا ومهشّمًا ومقيدًا بـuserType مع reuse detection وحالة الحساب. تغيير كلمة المرور يلغي الجلسات.

أصلح reset password ليحدث هوية واحدة، وأضيف schoolSlug عند الغموض. OTP عشوائي ومهشّم، مدته 10 دقائق وخمس محاولات ولا يطبع، مع rate limits.

Flutter يستخدم secure storage وsingle-flight refresh وretry واحد وHTTPS Release وlogout صحيح. الويب يجدد مرة ويرسل refresh عند logout.

المفتوح: OTP داخل ذاكرة نسخة واحدة ولا قناة إرسال، رموز الويب في localStorage، refresh الويب غير single-flight، وشاشات استعادة Flutter ما زالت Mock.

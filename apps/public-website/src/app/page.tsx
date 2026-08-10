import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex-shrink-0 font-bold text-2xl text-blue-600">
            مسار (Masar)
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600">المميزات</a>
            <a href="#roles" className="text-gray-600 hover:text-blue-600">الفئات المستفيدة</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600">الأسئلة الشائعة</a>
          </nav>
          <div className="flex gap-4">
            <a href="http://localhost:3002/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center">
              دخول المدارس
            </a>
            <a href="http://localhost:3001/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center">
              دخول المنصة
            </a>
            <Link href="/demo" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              اطلب نسخة تجريبية
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              الحل الأمثل لإدارة وتتبع النقل المدرسي
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              نظام متكامل يربط المدارس، وأولياء الأمور، والسائقين لضمان رحلة مدرسية آمنة، ذكية، وموثوقة.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/demo" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
                ابدأ الآن
              </Link>
              <a href="#features" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50">
                تعرف على المزيد
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">مميزات النظام</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'إدارة الحافلات', desc: 'تنظيم خطوط السير وإدارة أسطول الحافلات بكفاءة.' },
                { title: 'تتبع مباشر', desc: 'متابعة حية لمسار الحافلة وأماكن توقفها.' },
                { title: 'تواصل مع أولياء الأمور', desc: 'إشعارات لحظية لولي الأمر عند الركوب والنزول.' },
                { title: 'المدفوعات', desc: 'نظام متكامل لتتبع اشتراكات الطلاب ودفعها.' },
                { title: 'مزامنة بدون إنترنت', desc: 'تطبيق السائق يعمل حتى في حال انقطاع الشبكة ويزامن لاحقاً.' },
                { title: 'تقارير شاملة', desc: 'لوحة تحكم للمدرسة تقدم تحليلات تفصيلية للرحلات.' }
              ].map((f, i) => (
                <div key={i} className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">نظام واحد يخدم الجميع</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">للمدارس</h3>
                <p className="text-gray-600">إدارة مركزية للطلاب، الحافلات، السائقين، ومتابعة فورية للرحلات لضمان الجودة والأمان.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-green-600 mb-4">لأولياء الأمور</h3>
                <p className="text-gray-600">تطبيق خاص لتتبع حافلة الأبناء واستقبال الإشعارات عند الصعود والنزول بكل طمأنينة.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">للسائقين</h3>
                <p className="text-gray-600">تطبيق بسيط يرشد السائق في خط السير، ويسجل الحضور والانصراف، ويدعم العمل دون إنترنت.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">الأسئلة الشائعة</h2>
            <div className="space-y-6">
              {[
                { q: 'هل يمكن تشغيل تطبيق السائق بدون إنترنت؟', a: 'نعم، التطبيق مصمم للعمل في المناطق ضعيفة التغطية ويقوم بمزامنة البيانات فور توفر الاتصال.' },
                { q: 'هل يمكن لولي الأمر تتبع أكثر من طفل؟', a: 'بالتأكيد، يمكن لولي الأمر إضافة وتتبع جميع أبنائه من خلال نفس الحساب بسهولة.' },
                { q: 'كيف يمكن للمدرسة الاشتراك في الخدمة؟', a: 'يمكنكم طلب نسخة تجريبية من خلال تعبئة النموذج وسيقوم فريقنا بالتواصل معكم في أقرب وقت.' }
              ].map((faq, i) => (
                <div key={i} className="border-b border-gray-200 pb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مسار للنقل المدرسي.</p>
        </div>
      </footer>
    </div>
  );
}

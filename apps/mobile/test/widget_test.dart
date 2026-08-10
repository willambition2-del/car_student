import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:school_transport_mobile/main.dart';

void main() {
  testWidgets('App initializes and renders SplashScreen correctly', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: SchoolTransportApp()));
    await tester.pump();


    expect(find.text('منصة إدارة النقل المدرسي'), findsOneWidget);
  });
}

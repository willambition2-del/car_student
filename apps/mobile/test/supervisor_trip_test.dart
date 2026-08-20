import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:school_transport_mobile/features/supervisor/supervisor_active_trip_screen.dart';

void main() {
  testWidgets('SupervisorActiveTripScreen renders without exceptions', (WidgetTester tester) async {
    FlutterError.onError = (FlutterErrorDetails details) {
      print('FLUTTER ERROR CAUGHT IN TEST: ${details.exception}');
    };

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Directionality(
            textDirection: TextDirection.rtl,
            child: Scaffold(
              body: SupervisorActiveTripScreen(),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byType(SupervisorActiveTripScreen), findsOneWidget);
  });
}

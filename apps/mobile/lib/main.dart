import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/router/app_router.dart';
import 'app/theme/app_theme.dart';
import 'core/constants/app_constants.dart';
import 'core/notifications/push_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize self-hosted push notifications
  await PushService().init();
  
  runApp(const ProviderScope(child: SchoolTransportApp()));
}

class SchoolTransportApp extends StatefulWidget {
  const SchoolTransportApp({super.key});

  @override
  State<SchoolTransportApp> createState() => _SchoolTransportAppState();
}

class _SchoolTransportAppState extends State<SchoolTransportApp> with WidgetsBindingObserver {
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // Trigger notification refresh when app resumes
      // A Riverpod provider invalidation can be triggered here if you expose the ProviderContainer
      // e.g. ref.invalidate(unreadNotificationsProvider);
      print("App resumed: Refreshing unread notifications count from backend...");
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: appRouter,
      locale: const Locale('ar'),
      supportedLocales: const [Locale('ar'), Locale('en')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
    );
  }
}

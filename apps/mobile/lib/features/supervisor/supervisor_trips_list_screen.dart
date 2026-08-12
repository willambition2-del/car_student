import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bus_widgets.dart';
import '../../mock/mock_repository.dart';

class SupervisorTripsListScreen extends ConsumerWidget {
  const SupervisorTripsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(scheduledTripsProvider).when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (err, stack) => Scaffold(body: Center(child: Text("خطأ: $err"))),
      data: (trips) {
        return AppScaffold(
          title: 'جدول الرحلات المكلفة بها',
          subtitle: 'قائمة الرحلات الصباحية والمسائية اليومية',
          body: trips.isEmpty
              ? const Center(child: Text('لا توجد رحلات مجدولة'))
              : ListView.builder(
                  itemCount: trips.length,
                  itemBuilder: (context, index) {
                    final trip = trips[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10.0),
                      child: TripCard(
                        trip: trip,
                        onTap: () => context.push('/supervisor/trip/active'),
                      ),
                    );
                  },
                ),
        );
      },
    );
  }
}

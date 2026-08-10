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
    return ref.watch(activeTripProvider).when(
      data: (trip) {
        
    

    return AppScaffold(
      title: 'جدول الرحلات المكلفة بها',
      subtitle: 'قائمة الرحلات الصباحية والمسائية اليومية',
      body: ListView(
        children: [
          TripCard(
            trip: trip,
            onTap: () => context.push('/supervisor/trip/active'),
          ),
          const SizedBox(height: 10),
          TripCard(
            trip: MockData.activeTrip.copyWith(
              id: 'trip_102',
              tripType: 'رحلة العودة',
              startTime: '01:30 م',
              boardedCount: 0,
            ),
            onTap: () => context.push('/supervisor/trip/active'),
          ),
        ],
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

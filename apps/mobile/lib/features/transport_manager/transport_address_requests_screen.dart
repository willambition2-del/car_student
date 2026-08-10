import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/address_card.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../mock/mock_repository.dart';

class TransportAddressRequestsScreen extends ConsumerWidget {
  const TransportAddressRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(addressRequestsProvider).when(
      data: (requests) {
        
    

    return AppScaffold(
      title: 'طلبات تغيير العناوين المرفوعة',
      subtitle: 'مراجعة وتخصيص الحافلات المناسبة للطلاب',
      showBackButton: false,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/transport/address-requests',
      ),
      body: ListView.builder(
        itemCount: requests.length,
        itemBuilder: (context, index) {
          final req = requests[index];
          return AddressCard(
            request: req,
            onTap: () => context.push('/transport/address-review'),
          );
        },
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

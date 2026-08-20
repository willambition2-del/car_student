import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/map_widgets.dart';
import '../../mock/mock_repository.dart';

class ParentRouteMapScreen extends ConsumerWidget {
  const ParentRouteMapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final student = students.isNotEmpty
        ? students[selectedIndex]
        : MockData.students.first;

    final hasLocation = student.pickupPoint.isNotEmpty;

    return AppScaffold(
      title: 'خريطة المسار الثابت',
      subtitle: 'عرض نقاط التجمع والمسار المعتمد للحافلة',
      showBackButton: false,
      padding: EdgeInsets.zero,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/parent/route-map',
      ),
      body: Stack(
        children: [
          AppGoogleMapView(
            initialCenter: const LatLng(24.8195, 46.6625),
            initialZoom: 14.0,
            emptyNotice: hasLocation ? null : 'لم يتم تحديد موقع المنزل ونقطة التجمع لهذا الطالب بعد',
            markers: {
              const Marker(
                markerId: MarkerId('school_center'),
                position: LatLng(24.8210, 46.6690),
                infoWindow: InfoWindow(title: 'مدرسة تبيان التجريبية'),
              ),
              if (hasLocation)
                const Marker(
                  markerId: MarkerId('student_pickup'),
                  position: LatLng(24.8195, 46.6625),
                  infoWindow: InfoWindow(title: 'نقطة التجمع المعتمدة'),
                ),
            },
          ),
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.verified_outlined,
                        color: AppColors.successGreen,
                        size: 16,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'مسار معتمد من إدارة النقل',
                        style: AppTypography.caption.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  Text(
                    'بدون تتبع حي',
                    style: AppTypography.caption.copyWith(color: AppColors.mutedText),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: 12,
            left: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppRadius.borderLg,
                border: Border.all(color: AppColors.border, width: 1),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: AppColors.primarySoft,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.directions_bus_rounded,
                          color: AppColors.primaryNavy,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'حافلة رقم ${student.busNumber} • ${student.routeName}',
                              style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
                            ),
                            Text(
                              'السائق: ${MockData.currentDriverName} | المشرفة: ${MockData.currentSupervisorName}',
                              style: AppTypography.caption,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Divider(height: 1, color: AppColors.divider),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _RouteInfoItem(
                        label: 'نقطة الصعود',
                        value: student.pickupPoint,
                      ),
                      Container(width: 1, height: 24, color: AppColors.divider),
                      _RouteInfoItem(
                        label: 'نقطة النزول',
                        value: student.dropoffPoint,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  
      },
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \$error"))),
    );}
}

class _RouteInfoItem extends StatelessWidget {
  final String label;
  final String value;

  const _RouteInfoItem({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: AppTypography.titleSmall.copyWith(
            color: AppColors.primaryNavy,
            fontWeight: FontWeight.w700,
          ),
        ),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}

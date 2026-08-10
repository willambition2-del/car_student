import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/map_widgets.dart';
import '../../mock/mock_repository.dart';
import '../../mock/models/models.dart';

class TransportOperationsCenterScreen extends ConsumerStatefulWidget {
  const TransportOperationsCenterScreen({super.key});

  @override
  ConsumerState<TransportOperationsCenterScreen> createState() =>
      _TransportOperationsCenterScreenState();
}

class _TransportOperationsCenterScreenState
    extends ConsumerState<TransportOperationsCenterScreen> {
  final TextEditingController _searchController = TextEditingController();
  StudentModel? _selectedStudent;
  BusModel? _selectedBus;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final bus = MockData.activeBus;

    return AppScaffold(
      title: 'مركز الرقابة الميدانية والتشغيل',
      subtitle: 'تتبع حركة الأسطول والطلاب المباشرة',
      showBackButton: false,
      padding: EdgeInsets.zero,
      bottomNavigationBar: const RoleBottomNavigation(
        currentRoute: '/transport/operations',
      ),
      body: Stack(
        children: [
          const MapPlaceholder(
            title: 'خريطة تتبع أسطول الحافلات المباشرة',
            subtitle: 'تحديث لمستمر لـ 20 حافلة مدرسية و 480 طالب مسجل',
          ),
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: Column(
              children: [
                SearchField(
                  hintText: 'ابحث باسم الطالب، الحافلة، أو المسار...',
                  controller: _searchController,
                  onChanged: (val) {
                    setState(() {});
                  },
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(110, 34),
                          backgroundColor: AppColors.primaryNavy,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: AppRadius.borderLg,
                          ),
                        ),
                        icon: const Icon(
                          Icons.directions_bus_rounded,
                          size: 16,
                        ),
                        label: Text('حافلة ${bus.busNumber}', style: AppTypography.caption.copyWith(color: Colors.white)),
                        onPressed: () {
                          setState(() {
                            _selectedBus = bus;
                            _selectedStudent = null;
                          });
                        },
                      ),
                      const SizedBox(width: 6),
                      ...students.map((st) {
                        final isSelected = _selectedStudent?.id == st.id;
                        return Padding(
                          padding: const EdgeInsets.only(left: 6.0),
                          child: ChoiceChip(
                            label: Text(st.name),
                            selected: isSelected,
                            selectedColor: AppColors.primaryNavy,
                            backgroundColor: AppColors.surface,
                            side: BorderSide(
                              color: isSelected ? AppColors.primaryNavy : AppColors.border,
                            ),
                            labelStyle: AppTypography.caption.copyWith(
                              color: isSelected ? Colors.white : AppColors.mainText,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            ),
                            onSelected: (val) {
                              if (val) {
                                setState(() {
                                  _selectedStudent = st;
                                  _selectedBus = null;
                                });
                              }
                            },
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ],
            ),
          ),

          if (_selectedStudent != null)
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.person_pin_circle_outlined,
                              color: AppColors.primaryNavy,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'الطالب: ${_selectedStudent!.name}',
                              style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18),
                          onPressed: () => setState(() => _selectedStudent = null),
                        ),
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 6.0),
                      child: Divider(height: 1, color: AppColors.divider),
                    ),
                    Text(
                      'الصف والشعبة: ${_selectedStudent!.grade} - ${_selectedStudent!.section}',
                      style: AppTypography.caption,
                    ),
                    Text(
                      'نقطة الصعود: ${_selectedStudent!.pickupPoint}',
                      style: AppTypography.caption,
                    ),
                    Text(
                      'الحافلة والمسار: حافلة ${_selectedStudent!.busNumber} | ${_selectedStudent!.routeName}',
                      style: AppTypography.caption,
                    ),
                  ],
                ),
              ),
            )
          else if (_selectedBus != null)
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.directions_bus_outlined,
                              color: AppColors.primaryNavy,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'حافلة رقم ${_selectedBus!.busNumber}',
                              style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18),
                          onPressed: () => setState(() => _selectedBus = null),
                        ),
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 6.0),
                      child: Divider(height: 1, color: AppColors.divider),
                    ),
                    Text(
                      'اللوحة: ${_selectedBus!.plateNumber} • السائق: ${_selectedBus!.driverName}',
                      style: AppTypography.caption,
                    ),
                    Text(
                      'المشرفة: ${_selectedBus!.supervisorName}',
                      style: AppTypography.caption,
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

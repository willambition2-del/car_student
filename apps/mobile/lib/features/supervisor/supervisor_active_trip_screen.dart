import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_buttons.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../core/widgets/bottom_navigation.dart';
import '../../core/widgets/status_badge.dart';
import '../../core/widgets/student_widgets.dart';
import '../../mock/mock_repository.dart';
import '../../features/supervisor/services/trip_service.dart';
import '../../core/sync/sync_service.dart';
import '../../mock/models/models.dart';

class SupervisorActiveTripScreen extends ConsumerStatefulWidget {
  const SupervisorActiveTripScreen({super.key});

  @override
  ConsumerState<SupervisorActiveTripScreen> createState() =>
      _SupervisorActiveTripScreenState();
}

class _SupervisorActiveTripScreenState
    extends ConsumerState<SupervisorActiveTripScreen> {
  String _searchQuery = '';
  String _filterStatus = 'الكل';

  Future<void> _updateStudentStatus(StudentModel student, StudentTripStatus newStatus) async {
    final trip = ref.read(activeTripProvider).value;
    if (trip == null) return;
    
    try {
      await ref.read(tripServiceProvider).updateStudentStatus(trip.id, student.id, newStatus);
      ref.invalidate(activeTripStudentsProvider);
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('تم تسجيل: ${student.name} ← ${newStatus.label}'),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 2),
        ),
      );
    } catch (e) {
      // Offline or failed, enqueue it!
      await ref.read(syncServiceProvider).enqueueOperation(
        tripId: trip.id,
        studentId: student.id,
        studentName: student.name,
        status: newStatus.name.toUpperCase(),
      );
      ref.invalidate(syncOperationsProvider); // Refresh sync queue UI
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('فشل التحديث، تم الحفظ للمزامنة لاحقاً'),
          backgroundColor: AppColors.errorRed,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _showDropoffSheet(StudentModel student) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'طريقة تسليم الطالب (${student.name})',
                style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 12),
              ListTile(
                leading: const Icon(Icons.person_outline_rounded, color: AppColors.primaryNavy),
                title: const Text('تسليم لولي الأمر'),
                onTap: () {
                  Navigator.pop(ctx);
                  _updateStudentStatus(student, StudentTripStatus.droppedOff);
                },
              ),
              ListTile(
                leading: const Icon(Icons.verified_user_outlined, color: AppColors.primaryNavy),
                title: const Text('تسليم لشخص مصرح له'),
                onTap: () {
                  Navigator.pop(ctx);
                  _updateStudentStatus(student, StudentTripStatus.droppedOff);
                },
              ),
              ListTile(
                leading: const Icon(Icons.home_outlined, color: AppColors.primaryNavy),
                title: const Text('نزول أمام المنزل مباشر'),
                onTap: () {
                  Navigator.pop(ctx);
                  _updateStudentStatus(student, StudentTripStatus.droppedOff);
                },
              ),
              ListTile(
                leading: const Icon(Icons.location_on_outlined, color: AppColors.primaryNavy),
                title: const Text('نزول بنقطة التجمع المعينة'),
                onTap: () {
                  Navigator.pop(ctx);
                  _updateStudentStatus(student, StudentTripStatus.droppedOff);
                },
              ),
              ListTile(
                leading: const Icon(Icons.warning_amber_rounded, color: AppColors.errorRed),
                title: Text('تعذر التسليم (إعادة للمدرسة)', style: AppTypography.bodyMedium.copyWith(color: AppColors.errorRed)),
                onTap: () {
                  Navigator.pop(ctx);
                  _updateStudentStatus(student, StudentTripStatus.notPresent);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeTripState = ref.watch(activeTripProvider);
    final studentsState = ref.watch(activeTripStudentsProvider);

    return activeTripState.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (err, stack) => Scaffold(body: Center(child: Text("خطأ: $err"))),
      data: (trip) {
        if (trip == null) {
          return AppScaffold(
            title: 'الرحلة الحالية',
            bottomNavigationBar: const RoleBottomNavigation(
              currentRoute: '/supervisor/trip/active',
            ),
            body: Center(
              child: Text('لا توجد رحلة نشطة', style: AppTypography.titleLarge),
            ),
          );
        }
        return studentsState.when(
          loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
          error: (err, stack) => Scaffold(body: Center(child: Text("خطأ: $err"))),
          data: (students) {
            int boarded = students
                .where((s) => s.currentStatus == StudentTripStatus.boarded)
                .length;
            int absent = students
                .where((s) => s.currentStatus == StudentTripStatus.absent || s.currentStatus == StudentTripStatus.notPresent)
                .length;
            int remaining = students.length - (boarded + absent);

            final filteredStudents = students.where((s) {
              final matchesSearch = s.name.contains(_searchQuery) || s.pickupPoint.contains(_searchQuery);
              if (_filterStatus == 'الكل') return matchesSearch;
              if (_filterStatus == 'صعدوا') return matchesSearch && s.currentStatus == StudentTripStatus.boarded;
              if (_filterStatus == 'غائبون') return matchesSearch && (s.currentStatus == StudentTripStatus.absent || s.currentStatus == StudentTripStatus.notPresent);
              if (_filterStatus == 'متبقي') return matchesSearch && s.currentStatus == StudentTripStatus.waiting;
              return matchesSearch;
            }).toList();

            return AppScaffold(
              title: 'تنفيذ الرحلة الميدانية',
              subtitle: 'مسار ${trip.routeName} • حافلة ${trip.busNumber}',
              showBackButton: false,
              bottomNavigationBar: const RoleBottomNavigation(
                currentRoute: '/supervisor/trip/active',
              ),
              body: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: AppRadius.borderLg,
                      border: Border.all(color: AppColors.border, width: 1),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${trip.tripType} • ${trip.startTime}',
                              style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
                            ),
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppColors.successGreen,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text('متصل بالشبكة', style: AppTypography.caption),
                              ],
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
                            _StatMetric(label: 'المتوقع', value: '${students.length}', color: AppColors.mainText),
                            Container(width: 1, height: 24, color: AppColors.divider),
                            _StatMetric(label: 'صعدوا', value: '$boarded', color: AppColors.primaryNavy),
                            Container(width: 1, height: 24, color: AppColors.divider),
                            _StatMetric(label: 'غائبون', value: '$absent', color: AppColors.warningAmber),
                            Container(width: 1, height: 24, color: AppColors.divider),
                            _StatMetric(label: 'متبقي', value: '$remaining', color: AppColors.secondaryText),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

                  Row(
                    children: [
                      Expanded(
                        child: SearchField(
                          hintText: 'ابحث باسم الطالب أو نقطة التجميع...',
                          onChanged: (val) => setState(() => _searchQuery = val),
                        ),
                      ),
                      const SizedBox(width: 8),
                      PopupMenuButton<String>(
                        icon: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: AppRadius.borderLg,
                            border: Border.all(color: AppColors.border, width: 1),
                          ),
                          child: const Icon(
                            Icons.filter_list_rounded,
                            color: AppColors.primaryNavy,
                            size: 20,
                          ),
                        ),
                        onSelected: (val) => setState(() => _filterStatus = val),
                        itemBuilder: (ctx) => ['الكل', 'صعدوا', 'غائبون', 'متبقي'].map((f) {
                          return PopupMenuItem(value: f, child: Text(f));
                        }).toList(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'قائمة الطلاب (${filteredStudents.length})',
                        style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
                      ),
                      OutlineButton(
                        text: 'تأكيد الوصول للمدرسة',
                        icon: Icons.school_outlined,
                        height: 36,
                        width: null,
                        onPressed: () => context.push('/supervisor/school-arrival'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  Expanded(
                    child: ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: filteredStudents.length,
                      itemBuilder: (context, index) {
                        final student = filteredStudents[index];
                        final isOnBus = student.currentStatus == StudentTripStatus.boarded;
                        final isAbsent = student.currentStatus == StudentTripStatus.absent || student.currentStatus == StudentTripStatus.notPresent;
                        final isDroppedOff = student.currentStatus == StudentTripStatus.droppedOff || student.currentStatus == StudentTripStatus.arrived;

                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: AppRadius.borderLg,
                            border: Border.all(color: AppColors.border, width: 1),
                          ),
                          child: Row(
                            children: [
                              StudentAvatar(name: student.name, size: 40),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      student.name,
                                      style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
                                    ),
                                    Text(
                                      '${student.grade} • نقطة: ${student.pickupPoint}',
                                      style: AppTypography.caption,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),

                              if (isDroppedOff) ...[
                                const StatusBadge(label: 'تم النزول ✓', colorType: 'green'),
                              ] else if (isOnBus) ...[
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const StatusBadge(label: 'داخل الباص ✓', colorType: 'blue'),
                                    const SizedBox(width: 6),
                                    OutlineButton(
                                      text: 'النزول',
                                      height: 32,
                                      width: null,
                                      onPressed: () => _showDropoffSheet(student),
                                    ),
                                  ],
                                ),
                              ] else if (isAbsent) ...[
                                const StatusBadge(label: 'غائب', colorType: 'orange'),
                              ] else ...[
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    PrimaryButton(
                                      text: 'صعد',
                                      height: 34,
                                      width: null,
                                      backgroundColor: AppColors.primaryNavy,
                                      onPressed: () => _updateStudentStatus(student, StudentTripStatus.boarded),
                                    ),
                                    const SizedBox(width: 6),
                                    DangerButton(
                                      text: 'غائب',
                                      height: 34,
                                      width: null,
                                      onPressed: () => _updateStudentStatus(student, StudentTripStatus.absent),
                                    ),
                                  ],
                                ),
                              ],
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

class _StatMetric extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatMetric({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: AppTypography.titleSmall.copyWith(
            color: color,
            fontWeight: FontWeight.w700,
          ),
        ),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}

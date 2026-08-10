import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/date_selector.dart';
import '../../core/widgets/status_badge.dart';
import '../../mock/mock_repository.dart';

class StudentTripHistoryScreen extends ConsumerStatefulWidget {
  const StudentTripHistoryScreen({super.key});

  @override
  ConsumerState<StudentTripHistoryScreen> createState() =>
      _StudentTripHistoryScreenState();
}

class _StudentTripHistoryScreenState
    extends ConsumerState<StudentTripHistoryScreen> {
  String _selectedDate = '2026-08-01';

  @override
  Widget build(BuildContext context) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);
    final student = students.isNotEmpty
        ? students[selectedIndex]
        : MockData.students.first;

    return AppScaffold(
      title: 'سجل رحلات الطالب',
      subtitle: 'سجل أوقات الصعود والوصول التاريخية',
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DateSelector(
            label: 'تصفية بالتاريخ',
            selectedDate: _selectedDate,
            onTap: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime(2025),
                lastDate: DateTime(2027),
              );
              if (picked != null) {
                setState(
                  () => _selectedDate =
                      "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}",
                );
              }
            },
          ),
          const SizedBox(height: 14),
          Text(
            'رحلات $_selectedDate للطالب ${student.name}',
            style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: ListView(
              children: [
                _HistoryCard(
                  tripType: 'رحلة الصباح',
                  busNumber: student.busNumber,
                  time: '07:05 ص',
                  status: 'صعد الباص',
                  statusColor: 'green',
                  details:
                      'صعد الطالب في محطة حي الهدى ووصل المدرسة بسلام الساعة 07:40 ص',
                ),
                const SizedBox(height: 10),
                _HistoryCard(
                  tripType: 'رحلة العودة',
                  busNumber: student.busNumber,
                  time: '01:30 م',
                  status: 'نزل من الباص',
                  statusColor: 'green',
                  details:
                      'غادرت الحافلة المدرسة وتسلّم ولي الأمر الطالب في المنزل الساعة 02:10 م',
                ),
                const SizedBox(height: 10),
                _HistoryCard(
                  tripType: 'رحلة الصباح (سابقة)',
                  busNumber: student.busNumber,
                  time: '07:10 ص',
                  status: 'غائب بإذن',
                  statusColor: 'orange',
                  details: 'تم تقديم طلب غياب مسبق وتم إخطار المشرفة بنجاح',
                ),
              ],
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

class _HistoryCard extends StatelessWidget {
  final String tripType;
  final String busNumber;
  final String time;
  final String status;
  final String statusColor;
  final String details;

  const _HistoryCard({
    required this.tripType,
    required this.busNumber,
    required this.time,
    required this.status,
    required this.statusColor,
    required this.details,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.borderLg,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$tripType • حافلة $busNumber',
                style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.w600),
              ),
              StatusBadge(label: status, colorType: statusColor),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(
                Icons.access_time_rounded,
                size: 14,
                color: AppColors.mutedText,
              ),
              const SizedBox(width: 4),
              Text(time, style: AppTypography.caption),
            ],
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0),
            child: Divider(height: 1, color: AppColors.divider),
          ),
          Text(
            details,
            style: AppTypography.bodySmall.copyWith(color: AppColors.secondaryText),
          ),
        ],
      ),
    );
  }
}

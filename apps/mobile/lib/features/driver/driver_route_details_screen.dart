import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/information_row.dart';

class DriverRouteDetailsScreen extends StatelessWidget {
  const DriverRouteDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final stations = [
      {
        'name': 'محطة 1 - حي الهدى (بداية الخط)',
        'time': '06:45 ص',
        'done': true,
      },
      {'name': 'محطة 2 - شارع السلام', 'time': '07:00 ص', 'done': true},
      {'name': 'محطة 3 - شارع النور', 'time': '07:15 ص', 'done': false},
      {'name': 'محطة 4 - حي الروضة', 'time': '07:30 ص', 'done': false},
      {
        'name': 'مدرسة المستقبل الأهلية (محطة النهاية)',
        'time': '07:45 ص',
        'done': false,
      },
    ];

    return AppScaffold(
      title: 'تفاصيل مسار الحافلة',
      subtitle: 'جدول المحطات والمسافات المقررة',
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(14.0),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: AppRadius.borderLg,
              border: Border.all(color: AppColors.border, width: 1),
            ),
            child: Column(
              children: [
                InformationRow(
                  label: 'اسم المسار',
                  value: 'مسار حي الهدى - الحافلة 205',
                ),
                InformationRow(
                  label: 'إجمالي المحطات',
                  value: '${stations.length} محطات تجمع',
                ),
                InformationRow(
                  label: 'طول المسار',
                  value: '18.4 كم (45 دقيقة)',
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Text(
            'جدول وترتيب المحطات',
            style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),

          Expanded(
            child: ListView.builder(
              itemCount: stations.length,
              itemBuilder: (context, index) {
                final st = stations[index];
                final isDone = st['done'] as bool;
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
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: isDone ? AppColors.successGreen : AppColors.primarySoft,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            '${index + 1}',
                            style: AppTypography.caption.copyWith(
                              color: isDone ? Colors.white : AppColors.primaryNavy,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              st['name'] as String,
                              style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                            Text(
                              'الوقت المتوقع: ${st['time']}',
                              style: AppTypography.caption,
                            ),
                          ],
                        ),
                      ),
                      if (isDone)
                        const Icon(
                          Icons.check_circle_rounded,
                          color: AppColors.successGreen,
                          size: 18,
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

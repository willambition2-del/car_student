import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/status_badge.dart';

class TransportAlertsScreen extends ConsumerWidget {
  const TransportAlertsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alerts = [
      {
        'title': 'انقطاع إشارة GPS',
        'body': 'انقطع تتبع GPS للحافلة رقم 104 في مسار الروضة',
        'time': 'منذ 5 دقائق',
        'severity': 'red',
      },
      {
        'title': 'رحلة متأخرة عن الجدول',
        'body': 'تأخرت الحافلة 205 بـ 15 دقيقة بسبب الازدحام المروري',
        'time': 'منذ 12 دقيقة',
        'severity': 'orange',
      },
      {
        'title': 'طلب عنوان جديد',
        'body': 'تم تقديم طلب تغيير عنوان جديد للطالب محمد أحمد',
        'time': 'منذ 30 دقيقة',
        'severity': 'blue',
      },
    ];

    return AppScaffold(
      title: 'تنبيهات وأعطال التشغيل',
      subtitle: 'سجل التنبيهات والأحداث الطارئة للحافلات والمسارات',
      body: ListView.builder(
        itemCount: alerts.length,
        itemBuilder: (context, index) {
          final al = alerts[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: AppRadius.borderLg,
              border: Border.all(color: AppColors.border, width: 1),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.warning_amber_rounded,
                  color: al['severity'] == 'red'
                      ? AppColors.errorRed
                      : AppColors.warningAmber,
                  size: 22,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        al['title']!,
                        style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      Text(
                        al['body']!,
                        style: AppTypography.caption,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                StatusBadge(
                  label: al['time']!,
                  colorType: al['severity']!,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

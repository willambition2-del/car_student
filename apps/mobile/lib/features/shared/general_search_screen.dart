import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_radius.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/app_text_fields.dart';
import '../../mock/mock_repository.dart';

class GeneralSearchScreen extends ConsumerStatefulWidget {
  const GeneralSearchScreen({super.key});

  @override
  ConsumerState<GeneralSearchScreen> createState() =>
      _GeneralSearchScreenState();
}

class _GeneralSearchScreenState extends ConsumerState<GeneralSearchScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final bus = MockData.activeBus;

    final matchedStudents = students
        .where((s) => s.name.contains(_query) || s.pickupPoint.contains(_query))
        .toList();

    return AppScaffold(
      title: 'البحث الشامل في النظام',
      subtitle: 'البحث الموحد عن الطلاب والحافلات والمسارات',
      body: Column(
        children: [
          SearchField(
            hintText: 'ابحث عن طالب، حافلة، مسار، أو طلب...',
            onChanged: (val) => setState(() => _query = val),
          ),
          const SizedBox(height: 14),
          Expanded(
            child: _query.isEmpty
                ? Center(
                    child: Text(
                      'أدخل كلمة البحث لاستعراض النتائج المطابقة',
                      style: AppTypography.caption,
                    ),
                  )
                : ListView(
                    children: [
                      Text(
                        'نتائج الطلاب (${matchedStudents.length})',
                        style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      ...matchedStudents.map(
                        (st) => Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: AppRadius.borderLg,
                            border: Border.all(color: AppColors.border, width: 1),
                          ),
                          child: ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(
                                color: AppColors.primarySoft,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.person_outlined,
                                color: AppColors.primaryNavy,
                                size: 18,
                              ),
                            ),
                            title: Text(
                              st.name,
                              style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                            subtitle: Text(
                              '${st.grade} • حافلة ${st.busNumber}',
                              style: AppTypography.caption,
                            ),
                            onTap: () =>
                                context.push('/parent/student-details'),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Text('نتائج الحافلات والأسطول', style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppRadius.borderLg,
                          border: Border.all(color: AppColors.border, width: 1),
                        ),
                        child: ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: AppColors.primarySoft,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.directions_bus_outlined,
                              color: AppColors.primaryNavy,
                              size: 18,
                            ),
                          ),
                          title: Text(
                            'حافلة رقم ${bus.busNumber}',
                            style: AppTypography.titleSmall.copyWith(fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                          subtitle: Text(
                            'المسار: ${bus.routeName}',
                            style: AppTypography.caption,
                          ),
                        ),
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

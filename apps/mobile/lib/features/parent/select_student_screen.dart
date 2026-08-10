import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/app_typography.dart';
import '../../core/widgets/app_scaffold.dart';
import '../../core/widgets/student_widgets.dart';
import '../../mock/mock_repository.dart';

class SelectStudentScreen extends ConsumerWidget {
  const SelectStudentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ref.watch(studentsListProvider).when(
      data: (students) {
        
    
    final selectedIndex = ref.watch(selectedStudentIndexProvider);

    return AppScaffold(
      title: 'اختيار الطالب',
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'حدد الطالب للبدء بمتابعة رحلته المدرسية وتفاصيله الخاصة:',
            style: AppTypography.bodyMedium,
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.separated(
              itemCount: students.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final student = students[index];
                final isSelected = index == selectedIndex;

                return StudentCard(
                  student: student,
                  isSelected: isSelected,
                  onTap: () {
                    ref.read(selectedStudentIndexProvider.notifier).state =
                        index;
                    context.pop();
                  },
                );
              },
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

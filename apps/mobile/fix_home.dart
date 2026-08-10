import 'dart:io';

void main() {
  final f1 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_home_screen.dart');
  String c1 = f1.readAsStringSync();
  c1 = c1.replaceAll('captiontrip.copyWith', 'caption.copyWith');
  c1 = c1.replaceAll('titleLargetrip.copyWith', 'titleLarge.copyWith');
  c1 = c1.replaceAll('titleMediumtrip.copyWith', 'titleMedium.copyWith');
  c1 = c1.replaceAll('titleSmalltrip.copyWith', 'titleSmall.copyWith');
  f1.writeAsStringSync(c1);

  final f2 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart');
  String c2 = f2.readAsStringSync();
  
  // The error: Expected to find ')' - lib\features\supervisor\supervisor_end_trip_screen.dart:165:8
  // This is near the end of the `Widget build(BuildContext context)` before `_SummaryItem` class.
  // We added `  }\n}` at the end but the `.when` has `loading: () => ..., error: (error, stack) => ...)`
  // Did we close `.when(` properly?
  // Let's rewrite the end of `Widget build` block in `supervisor_end_trip_screen.dart`:
  
  int classSummaryIdx = c2.indexOf('class _SummaryItem extends StatelessWidget');
  if (classSummaryIdx != -1) {
    // we search backwards for the error/loading block
    int whenIdx = c2.lastIndexOf('error: (error, stack) => Scaffold(body: Center(child: Text("Error: \\\$error"))),', classSummaryIdx);
    if (whenIdx != -1) {
       // Replace the end of `when` up to `class _SummaryItem`
       String newEnd = 'error: (error, stack) => Scaffold(body: Center(child: Text("Error: \\\$error"))),\n    );\n  }\n}\n\n';
       c2 = c2.substring(0, whenIdx) + newEnd + c2.substring(classSummaryIdx);
    }
  }
  
  f2.writeAsStringSync(c2);
}

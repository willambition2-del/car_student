import 'dart:io';

void main() {
  final f1 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_home_screen.dart');
  String c1 = f1.readAsStringSync();
  c1 = c1.replaceAll('ref.read(activeTripProvider.notifier).state = trip\n                          .copyWith(', '// ref.read(activeTripProvider.notifier).state = trip\n                          // .copyWith(');
  c1 = c1.replaceAll('TripModel(', 'trip.copyWith(');
  c1 = c1.replaceAll('.copyWith(', 'trip.copyWith(');
  c1 = c1.replaceAll('triptrip.copyWith(', 'trip.copyWith('); // fix double if occurred
  f1.writeAsStringSync(c1);

  final f2 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart');
  String c2 = f2.readAsStringSync();
  if (c2.contains('        Text(label, style: AppTypography.caption),\n      ],\n\n  }\n}')) {
    c2 = c2.replaceAll('        Text(label, style: AppTypography.caption),\n      ],\n\n  }\n}', '        Text(label, style: AppTypography.caption),\n      ],\n    );\n  }\n}');
  }
  // Try one more aggressive fix for the end of the file.
  if (c2.contains('        Text(label, style: AppTypography.caption),\n      ],\n  }\n}')) {
     c2 = c2.replaceAll('        Text(label, style: AppTypography.caption),\n      ],\n  }\n}', '        Text(label, style: AppTypography.caption),\n      ],\n    );\n  }\n}');
  }
  // If we miss ')' at 165
  if (!c2.contains('    );\n  }\n}')) {
     c2 = c2.replaceAll('      ],\n  }\n}', '      ],\n    );\n  }\n}');
  }
  f2.writeAsStringSync(c2);
  
  final f3 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\school_arrival_screen.dart');
  String c3 = f3.readAsStringSync();
  c3 = c3.replaceAll('students?.map', '(students ?? []).map');
  f3.writeAsStringSync(c3);
  
  final f4 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_active_trip_screen.dart');
  String c4 = f4.readAsStringSync();
  c4 = c4.replaceAll('students?.map', '(students ?? []).map');
  f4.writeAsStringSync(c4);
}

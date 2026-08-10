import 'dart:io';

void main() {
  final f3 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\school_arrival_screen.dart');
  String c3 = f3.readAsStringSync();
  c3 = c3.replaceAll('students.map', '(students ?? []).map');
  f3.writeAsStringSync(c3);
  
  final f4 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_active_trip_screen.dart');
  String c4 = f4.readAsStringSync();
  c4 = c4.replaceAll('students.map', '(students ?? []).map');
  f4.writeAsStringSync(c4);
}

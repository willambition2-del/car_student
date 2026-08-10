import 'dart:io';

void main() {
  final f1 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart');
  if (f1.existsSync()) {
    String c1 = f1.readAsStringSync();
    c1 = c1.replaceAll('// ref.read(activeTripProvider.notifier).state = trip.copyWith(\n      status: TripStatus.completed,\n    );', '');
    c1 = c1.replaceAll('final trip = ref.read(activeTripProvider).value;', '');
    c1 = c1.replaceAll('status: TripStatus.completed,\n    );', '');
    c1 = c1.replaceAll('status: TripStatus.completed,', '');
    c1 = c1.replaceAll('    );', '');
    f1.writeAsStringSync(c1);
  }
  
  final f2 = File(r'D:\school-transport-saas\apps\mobile\lib\features\auth\login_screen.dart');
  if (f2.existsSync()) {
    String c2 = f2.readAsStringSync();
    int idx = c2.indexOf('const SizedBox(height: 20);\n                  const Divider');
    if (idx != -1) {
      int endIdx = c2.indexOf('                ],\n              ),\n            ),\n          ),\n        ),\n      ),\n    );');
      if (endIdx != -1) {
         c2 = c2.substring(0, idx) + '                ],\n              ),\n            ),\n          ),\n        ),\n      ),\n    );' + c2.substring(endIdx + 92);
      }
    }
    c2 = c2.replaceAll(RegExp(r'const Divider\(color: AppColors.divider, height: 1\);[\s\S]*?onTap: \(\) => _loginWithRole\(UserRole\.transportManager\),\n                      \),\n                    \],\n                  \),'), '');
    c2 = c2.replaceAll("import '../../core/storage/secure_storage_service.dart';", "");
    
    // Quick fix for the other unremoved Demo text
    c2 = c2.replaceAll(RegExp(r'Text\(\s*.*?Demo.*?,\s*style.*?,\s*textAlign.*?\),', multiLine: true, dotAll: true), '');
    c2 = c2.replaceAll('const SizedBox(height: 10);', '');
    c2 = c2.replaceAll('const SizedBox(height: 16);', '');
    
    f2.writeAsStringSync(c2);
  }
  
  final f3 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\school_arrival_screen.dart');
  if (f3.existsSync()) {
    String c3 = f3.readAsStringSync();
    c3 = c3.replaceAll('students.map', 'students?.map');
    f3.writeAsStringSync(c3);
  }
  
  final f4 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_active_trip_screen.dart');
  if (f4.existsSync()) {
    String c4 = f4.readAsStringSync();
    c4 = c4.replaceAll('students.map', 'students?.map');
    f4.writeAsStringSync(c4);
  }
  
  // one more error: supervisor_home_screen copyWith missing! 
  // It says "The static method or constructor 'copyWith' isn't defined for the context type '_'".
  final f5 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_home_screen.dart');
  if (f5.existsSync()) {
    String c5 = f5.readAsStringSync();
    c5 = c5.replaceAll('trip.copyWith(', 'TripModel(');
    f5.writeAsStringSync(c5);
  }
}

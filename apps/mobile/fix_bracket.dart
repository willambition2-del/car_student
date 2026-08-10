import 'dart:io';

void main() {
  final f1 = File(r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart');
  String c1 = f1.readAsStringSync();
  c1 = c1.replaceAll('          ],\n        ),\n      );\n      },', '          ],\n        ),\n      ),\n    );\n      },');
  f1.writeAsStringSync(c1);
}

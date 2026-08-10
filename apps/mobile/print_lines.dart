import 'dart:io';

void main() {
  var lines = File('lib/features/supervisor/supervisor_end_trip_screen.dart').readAsLinesSync();
  for (int i = 155; i <= 170; i++) {
    print('${i+1}: ${lines[i]}');
  }
}

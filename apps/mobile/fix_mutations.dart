import 'dart:io';

void main() {
  final dir = Directory(r'D:\school-transport-saas\apps\mobile\lib\features');
  final files = dir.listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.dart'));
  
  final providers = [
    'studentsListProvider',
    'activeTripProvider',
    'addressRequestsProvider',
    'absenceRequestsProvider',
    'syncOperationsProvider',
    'driverIncidentsProvider',
    'supportTicketsProvider',
    'notificationsProvider',
  ];

  for (final file in files) {
    String content = file.readAsStringSync();
    String original = content;

    for (final provider in providers) {
      final regExp = RegExp(r'(ref\.read\(' + provider + r'\.notifier\)\.state\s*=[^;]+;)');
      content = content.replaceAllMapped(regExp, (match) => '// ${match.group(1)}');
    }
    
    if (content != original) {
      file.writeAsStringSync(content);
      print('Modified: ${file.path}');
    }
  }
}

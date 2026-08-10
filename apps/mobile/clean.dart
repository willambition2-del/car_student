import 'dart:io';

void main() {
  final dir = Directory(r'D:\school-transport-saas\apps\mobile\lib\features');
  final files = dir.listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.dart')).toList();

  final Map<String, String> providerToVarName = {
    'studentsListProvider': 'students',
    'activeTripProvider': 'trip',
    'addressRequestsProvider': 'requests',
    'absenceRequestsProvider': 'requests',
    'syncOperationsProvider': 'ops', // or syncOps, we will check
    'driverIncidentsProvider': 'incidents',
    'supportTicketsProvider': 'tickets',
    'notificationsProvider': 'notifications',
  };

  for (final file in files) {
    String content = file.readAsStringSync();
    bool changed = false;

    // 1. Clean up messed up $1 lines and restore normal ref.watch.
    // Also, some files might still have `final $1Async = ...` or `final varNameAsync = ...`
    for (final entry in providerToVarName.entries) {
      final p = entry.key;
      // We don't know the exact var name for sure, so we will use the default, except if we can guess it.
      // But we just replace `final $1 = ref.watch(P);` with `final P_VAR = ref.watch(P);`
      
      if (content.contains('ref.watch($p)')) {
        // Find if there is a variable assignment
        if (content.contains('final \$1 = ref.watch($p);')) {
           String vName = entry.value;
           if (p == 'syncOperationsProvider' && content.contains('syncOps')) {
             vName = 'syncOps';
           }
           content = content.replaceAll('final \$1 = ref.watch($p);', 'final $vName = ref.watch($p);');
           changed = true;
        }
        
        // Let's also check if there is `final varAsync = ref.watch(p);` which we need to revert
        final r2 = RegExp(r'final\s+(\w+)Async\s*=\s*ref\.watch\(' + p + r'\);');
        content = content.replaceAllMapped(r2, (m) {
           changed = true;
           return 'final ${m.group(1)} = ref.watch($p);';
        });
        
        // Remove bad when blocks
        final r3 = RegExp(r'return ref\.watch\(' + p + r'\)\.when\([\s\S]*?data:\s*\(\w+\)\s*\{\s*');
        if (r3.hasMatch(content)) {
          content = content.replaceAll(r3, 'return ');
          changed = true;
        }
      }
    }
    
    // 2. Remove trailing error/loading blocks that were inserted
    final badTail1 = RegExp(r'\},\s*loading:\s*\(\)\s*=>\s*const\s*Scaffold\(body:\s*Center\(child:\s*CircularProgressIndicator\(\)\)\),\s*error:\s*\(error,\s*stack\)\s*=>\s*Scaffold\(body:\s*Center\(child:\s*Text\("Error: \\\$error"\)\)\),\s*\);');
    if (badTail1.hasMatch(content)) {
      content = content.replaceAll(badTail1, ';');
      changed = true;
    }
    final badTail2 = RegExp(r',\s*loading:\s*\(\)\s*=>\s*const\s*Scaffold\(body:\s*Center\(child:\s*CircularProgressIndicator\(\)\)\),\s*error:\s*\(error,\s*stack\)\s*=>\s*Scaffold\(body:\s*Center\(child:\s*Text\(' + r"'" + r'Error: \$error' + r"'" + r'\)\)\),\s*\);');
    if (badTail2.hasMatch(content)) {
      content = content.replaceAll(badTail2, ';');
      changed = true;
    }

    if (changed) {
      file.writeAsStringSync(content);
      print('Cleaned ${file.path}');
    }
  }
}

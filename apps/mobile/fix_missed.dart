import 'dart:io';

void main() {
  final dir = Directory(r'D:\school-transport-saas\apps\mobile\lib\features');
  final files = dir.listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.dart')).toList();

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
    bool needsSave = false;

    // 1. Manually check files that failed and wrap them properly.
    // If a file has `final someVar = ref.watch(Provider);` and NOT `Provider).when`, it means it's not wrapped.
    for (final p in providers) {
      if (content.contains('ref.watch($p)') && !content.contains('ref.watch($p).when')) {
        // Find the build method start
        int buildStart = content.indexOf('Widget build(BuildContext context');
        if (buildStart != -1) {
          int bodyStart = content.indexOf('{', buildStart);
          if (bodyStart != -1) {
            // Find end of build method
            int openBraces = 0;
            int bodyEnd = -1;
            for (int i = bodyStart; i < content.length; i++) {
              if (content[i] == '{') openBraces++;
              if (content[i] == '}') {
                openBraces--;
                if (openBraces == 0) {
                  bodyEnd = i;
                  break;
                }
              }
            }
            
            if (bodyEnd != -1) {
              String buildBody = content.substring(bodyStart + 1, bodyEnd);
              
              // Find all final varName = ref.watch(p);
              final regex = RegExp(r'final\s+(\w+)\s*=\s*ref\.watch\(' + p + r'\);');
              final match = regex.firstMatch(buildBody);
              
              if (match != null) {
                String varName = match.group(1)!;
                buildBody = buildBody.replaceFirst(match.group(0)!, '');
                
                String wrapped = '\n    return ref.watch($p).when(\n      data: ($varName) {\n        $buildBody\n      },\n      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),\n      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \\\$error"))),\n    );';
                
                content = content.substring(0, bodyStart + 1) + wrapped + content.substring(bodyEnd);
                needsSave = true;
              }
            }
          }
        }
      }
    }
    
    // Some files might be messed up from `.when()` being added on `ops` variable itself, e.g. `ops.when(data: ...)`
    if (needsSave) {
      file.writeAsStringSync(content);
      print('Fixed ${file.path}');
    }
  }
}

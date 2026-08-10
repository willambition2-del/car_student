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
    
    // Check if it has any of our providers
    bool hasProvider = false;
    for (final p in providers) {
      if (content.contains(p)) hasProvider = true;
    }
    if (!hasProvider) continue;
    
    // First, let's revert it back to normal (removing our previous botched attempts)
    for (final p in providers) {
      content = content.replaceAll(RegExp(r'final\s+(\w+)Async\s*=\s*ref\.watch\(' + p + r'\);'), 'final \$1 = ref.watch($p);');
      content = content.replaceAll(RegExp(r'\w+Async\.when\(\s*data:\s*\(\w+\)\s*=>\s*'), '');
      content = content.replaceAll(RegExp(r',\s*loading:\s*\(\)\s*=>\s*const\s*Scaffold\(body:\s*Center\(child:\s*CircularProgressIndicator\(\)\)\),\s*error:\s*\(error,\s*stack\)\s*=>\s*Scaffold\(body:\s*Center\(child:\s*Text\(' + r"'" + r'Error: \$error' + r"'" + r'\)\)\),\s*\)'), '');
      content = content.replaceAll(RegExp(r',\s*loading:\s*\(\)\s*=>\s*const\s*Scaffold\(body:\s*Center\(child:\s*CircularProgressIndicator\(\)\)\),\s*error:\s*\(error,\s*stack\)\s*=>\s*Scaffold\(body:\s*Center\(child:\s*Text\("Error: \\\$error"\)\)\),\s*\)'), '');
    }

    // Now, we will find the build method
    final buildRegex = RegExp(r'Widget build\(BuildContext context(?:,\s*WidgetRef\s+ref)?\)\s*\{');
    final buildMatch = buildRegex.firstMatch(content);
    if (buildMatch == null) {
      file.writeAsStringSync(content);
      continue;
    }
    
    int buildStart = buildMatch.end;
    // Find matching brace for build method
    int openBraces = 1;
    int buildEnd = -1;
    for (int i = buildStart; i < content.length; i++) {
      if (content[i] == '{') openBraces++;
      if (content[i] == '}') {
        openBraces--;
        if (openBraces == 0) {
          buildEnd = i;
          break;
        }
      }
    }
    
    if (buildEnd != -1) {
      String buildBody = content.substring(buildStart, buildEnd);
      
      // Look for ref.watch in the build body
      final watchRegex = RegExp(r'final\s+(\w+)\s*=\s*ref\.watch\((studentsListProvider|activeTripProvider|addressRequestsProvider|absenceRequestsProvider|syncOperationsProvider|driverIncidentsProvider|supportTicketsProvider|notificationsProvider)\);');
      final matches = watchRegex.allMatches(buildBody).toList();
      
      if (matches.isNotEmpty) {
        String newBuildBody = buildBody;
        
        for (final match in matches) {
          String varName = match.group(1)!;
          String providerName = match.group(2)!;
          
          // Remove the declaration
          newBuildBody = newBuildBody.replaceFirst(match.group(0)!, '');
          
          // Wrap the rest
          newBuildBody = '\n    return ref.watch($providerName).when(\n      data: ($varName) {\n        $newBuildBody\n      },\n      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),\n      error: (error, stack) => Scaffold(body: Center(child: Text("Error: \\\$error"))),\n    );';
        }
        
        content = content.substring(0, buildStart) + newBuildBody + content.substring(buildEnd);
      }
    }
    
    file.writeAsStringSync(content);
    print('Fully fixed ${file.path}');
  }
}

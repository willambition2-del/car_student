import 'dart:io';

void main() {
  final files = [
    r'D:\school-transport-saas\apps\mobile\lib\features\driver\driver_home_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\notifications\notifications_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\absence_history_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\absence_request_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\address_change_request_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\address_requests_list_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\address_request_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\parent_home_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\parent_route_map_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\parent_trip_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\select_student_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\student_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\student_trip_history_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\shared\general_search_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\shared\tech_support_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\school_arrival_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\student_in_trip_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_active_trip_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_home_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_trips_list_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\sync_log_list_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\sync_operation_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\transport_manager\transport_address_requests_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\transport_manager\transport_address_review_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\transport_manager\transport_operations_center_screen.dart',
  ];

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

  for (final filepath in files) {
    final file = File(filepath);
    if (!file.existsSync()) continue;
    
    String content = file.readAsStringSync();
    final asyncVars = <List<String>>[]; // [varName, provider]
    
    for (final provider in providers) {
      final patternRead = RegExp(r'final\s+(\w+)\s*=\s*ref\.read\(' + provider + r'\);');
      if (patternRead.hasMatch(content)) {
        final matchR = patternRead.firstMatch(content)!;
        final varName = matchR.group(1)!;
        
        // Wait, if it's TripModel it's not a list, but we can't tell here. 
        // We will just use .value to get the value.
        // Or .valueOrNull.
        content = content.replaceFirst(matchR.group(0)!, 'final $varName = ref.read($provider).value;');
      }
      
      final patternWatch = RegExp(r'final\s+(\w+)\s*=\s*ref\.watch\(' + provider + r'\);');
      if (patternWatch.hasMatch(content)) {
        final matchW = patternWatch.firstMatch(content)!;
        final varName = matchW.group(1)!;
        asyncVars.add([varName, provider]);
        content = content.replaceFirst(matchW.group(0)!, 'final ${varName}Async = ref.watch($provider);');
      }
    }

    if (asyncVars.isEmpty) {
      if (content != file.readAsStringSync()) {
        file.writeAsStringSync(content);
      }
      continue;
    }
    
    final returnMatch = RegExp(r'\breturn\s+(Scaffold|DefaultTabController|SafeArea|ListView|Container|Center|Padding|Column|Row|CustomScrollView|SingleChildScrollView|Card)\b').firstMatch(content);
    
    if (returnMatch != null) {
      int startIdx = returnMatch.start;
      int openBrackets = 0;
      int endIdx = -1;
      bool inString = false;
      String stringChar = '';
      
      for (int i = startIdx; i < content.length; i++) {
        String char = content[i];
        if ((char == "'" || char == '"') && content[i-1] != '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (stringChar == char) {
            inString = false;
          }
        }
        
        if (!inString) {
          if (char == '(' || char == '{' || char == '[') {
            openBrackets++;
          } else if (char == ')' || char == '}' || char == ']') {
            openBrackets--;
          } else if (char == ';' && openBrackets == 0) {
            endIdx = i;
            break;
          }
        }
      }
      
      if (endIdx != -1) {
        String returnStmt = content.substring(startIdx, endIdx + 1);
        
        String prefix = "return ";
        String suffix = ";";
        
        for (final pair in asyncVars) {
          final varName = pair[0];
          prefix += "${varName}Async.when(\n      data: ($varName) => ";
          suffix = ",\n      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),\n      error: (error, stack) => Scaffold(body: Center(child: Text('Error: \$error'))),\n    )" + suffix;
        }
        
        String wrappedReturn = prefix + returnStmt.replaceFirst('return ', '')
            .replaceAll(RegExp(r';$'), '') + suffix;
            
        content = content.substring(0, startIdx) + wrappedReturn + content.substring(endIdx + 1);
        
        file.writeAsStringSync(content);
        print('Updated $filepath');
      }
    } else {
      // If we couldn't find a matching return, just write the modified content (vars -> varsAsync)
      // This will break compilation for this file, but we can fix manually
      file.writeAsStringSync(content);
      print('Updated without return wrap: $filepath');
    }
  }
}

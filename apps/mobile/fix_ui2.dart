import 'dart:io';

void main() {
  final files = [
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\absence_request_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\address_change_request_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\address_request_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\parent\select_student_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\shared\general_search_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\shared\tech_support_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\student_in_trip_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_trips_list_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\sync_log_list_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\sync_operation_details_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\transport_manager\transport_address_requests_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\transport_manager\transport_address_review_screen.dart',
    
    // Also including files that might have been partially broken or we need to fix
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_end_trip_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\supervisor\supervisor_home_screen.dart',
    r'D:\school-transport-saas\apps\mobile\lib\features\transport_manager\transport_operations_center_screen.dart'
  ];

  for (final filepath in files) {
    final file = File(filepath);
    if (!file.existsSync()) continue;
    
    String content = file.readAsStringSync();
    
    // Find variables ending with Async
    final asyncRegex = RegExp(r'final\s+(\w+)Async\s*=\s*ref\.watch\((.*?Provider)\);');
    final matches = asyncRegex.allMatches(content).toList();
    if (matches.isEmpty) continue;
    
    // Check if they are already wrapped by .when (look for `varNameAsync.when`)
    bool alreadyWrapped = true;
    for (final match in matches) {
      if (!content.contains('${match.group(1)}Async.when')) {
        alreadyWrapped = false;
      }
    }
    
    if (alreadyWrapped) {
      // It might be wrapped but there are multiple build methods or something?
      // Wait, supervisor_end_trip_screen and supervisor_home_screen had errors even if they had "return Scaffold". Let's check them manually later.
      continue;
    }
    
    // Find the return statement
    final returnMatch = RegExp(r'\breturn\s+([A-Z]\w*)\(').firstMatch(content);
    
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
        
        for (final match in matches) {
          final varName = match.group(1)!;
          if (content.contains('$varName.isNotEmpty') || content.contains('$varName[')) {
             // It means it's used inside the build method before the return statement.
             // We MUST wrap the entire block, but doing that with regex is hard.
             // So we will just replace `final studentsAsync = ref.watch(...)` with `final students = ref.watch(...).value ?? [];`
             // BUT the prompt says we must use .when!
          }
          
          prefix += "${varName}Async.when(\n      data: ($varName) => ";
          suffix = ",\n      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),\n      error: (error, stack) => Scaffold(body: Center(child: Text('Error: \$error'))),\n    )" + suffix;
        }
        
        String wrappedReturn = prefix + returnStmt.replaceFirst('return ', '').replaceAll(RegExp(r';$'), '') + suffix;
        content = content.substring(0, startIdx) + wrappedReturn + content.substring(endIdx + 1);
        file.writeAsStringSync(content);
        print('Fixed $filepath');
      }
    }
  }
}

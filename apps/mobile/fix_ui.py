import os
import re

files = [
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
]

providers = [
    'studentsListProvider',
    'activeTripProvider',
    'addressRequestsProvider',
    'absenceRequestsProvider',
    'syncOperationsProvider',
    'driverIncidentsProvider',
    'supportTicketsProvider',
    'notificationsProvider',
]

for filepath in files:
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    async_vars = []
    
    for provider in providers:
        pattern_read = r'final\s+(\w+)\s*=\s*ref\.read\(' + provider + r'\);'
        match_r = re.search(pattern_read, content)
        if match_r:
            var_name = match_r.group(1)
            content = re.sub(pattern_read, f"final {var_name} = ref.read({provider}).value ?? [];", content)
            
        pattern_watch = r'final\s+(\w+)\s*=\s*ref\.watch\(' + provider + r'\);'
        match_w = re.search(pattern_watch, content)
        if match_w:
            var_name = match_w.group(1)
            async_vars.append((var_name, provider))
            content = re.sub(pattern_watch, f"final {var_name}Async = ref.watch({provider});", content)

    if not async_vars:
        if content != open(filepath, 'r', encoding='utf-8').read():
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        continue
        
    return_match = re.search(r'\breturn\s+(Scaffold|DefaultTabController|SafeArea|ListView|Container|Center|Padding|Column|Row|CustomScrollView|SingleChildScrollView|Card)\b', content)
    
    if return_match:
        start_idx = return_match.start()
        open_brackets = 0
        end_idx = -1
        in_string = False
        string_char = ''
        
        for i in range(start_idx, len(content)):
            char = content[i]
            if char in "'\"" and content[i-1] != '\\':
                if not in_string:
                    in_string = True
                    string_char = char
                elif string_char == char:
                    in_string = False
            
            if not in_string:
                if char in '({[':
                    open_brackets += 1
                elif char in ')}]':
                    open_brackets -= 1
                elif char == ';' and open_brackets == 0:
                    end_idx = i
                    break
        
        if end_idx != -1:
            return_stmt = content[start_idx:end_idx+1]
            
            prefix = "return "
            suffix = ";"
            for var_name, _ in async_vars:
                prefix += f"{var_name}Async.when(\n      data: ({var_name}) => "
                # Try to import material if not present, though it usually is
                suffix = f",\n      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),\n      error: (error, stack) => Scaffold(body: Center(child: Text('Error: $error'))),\n    )" + suffix
                
            wrapped_return = prefix + return_stmt.replace('return ', '', 1).rstrip(';') + suffix
            content = content[:start_idx] + wrapped_return + content[end_idx+1:]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")

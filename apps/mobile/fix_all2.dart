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
      content = content.replaceAllMapped(RegExp(r'final\s+(\w+)Async\s*=\s*ref\.watch\(' + p + r'\);'), (m) => 'final ${m.group(1)} = ref.watch($p);');
      content = content.replaceAllMapped(RegExp(r'final\s+\$1\s*=\s*ref\.watch\(' + p + r'\);'), (m) => ''); // Remove the bad $1 lines! Oh wait, we need to know the original var name!
    }
    
    // Wait, since we replaced varName with $1, we lost the variable name!
    // BUT we know the variable name from context in most cases, or from the provider name.
    // Let's just fix it manually for the known ones:
    content = content.replaceAll(r'final $1 = ref.watch(studentsListProvider);', r'final students = ref.watch(studentsListProvider);');
    content = content.replaceAll(r'final $1 = ref.watch(activeTripProvider);', r'final trip = ref.watch(activeTripProvider);');
    content = content.replaceAll(r'final $1 = ref.watch(addressRequestsProvider);', r'final requests = ref.watch(addressRequestsProvider);');
    content = content.replaceAll(r'final $1 = ref.watch(absenceRequestsProvider);', r'final requests = ref.watch(absenceRequestsProvider);');
    content = content.replaceAll(r'final $1 = ref.watch(syncOperationsProvider);', r'final syncOps = ref.watch(syncOperationsProvider);');
    content = content.replaceAll(r'final $1 = ref.watch(syncOperationsProvider);', r'final ops = ref.watch(syncOperationsProvider);'); // sync_log_list_screen uses 'ops'
    // For sync_log_list_screen and sync_operation_details_screen it's 'ops' or 'syncOps'. I'll just use 'ops' if 'ops' is missing, else 'syncOps'. Let's just replace all and then we will re-wrap.
    
    // Wait, the newWrap script already removed the var declarations entirely in the second step!
    // "newBuildBody = newBuildBody.replaceFirst(match.group(0)!, '');"
    // So the `$1` declarations might just be sitting there, AND the wrapped `.when(data: (varName) {` might be using `$1`!
    // Let's check `buildBody`.
    
    // To be absolutely safe, I will just git checkout the files!
    // BUT git is not a repository!
  }
}

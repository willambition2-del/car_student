import os
import re
import glob

features_dir = r"D:\school-transport-saas\apps\mobile\lib\features"

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

for root, dirs, files in os.walk(features_dir):
    for file in files:
        if file.endswith('.dart'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Step 1: Comment out mutator reads because we don't need demo mutations
            for provider in providers:
                # e.g. ref.read(studentsListProvider.notifier).state = ...
                content = re.sub(r'(ref\.read\(' + provider + r'\.notifier\)\.state\s*=[^;]+;)', r'// \1', content)
                
                # e.g. ref.read(studentsListProvider) -> if not watched
                # this might be tricky, skip for now unless it causes errors.

            # Step 2: Handle ref.watch in build methods. 
            # We want to change:
            # final students = ref.watch(studentsListProvider);
            # ... UI using students ...
            # Into AsyncValue handling, but it's hard to parse AST.
            # However, if we just do:
            # final studentsAsync = ref.watch(studentsListProvider);
            # return studentsAsync.when(
            #   data: (students) { ... original code ... },
            #   loading: () => CircularProgressIndicator(),
            #   error: (err, stack) => Text('Error: $err'),
            # );
            # We can try to inject this if we find a build method or similar.
            
            # Since doing this automatically via python is hard to get right without breaking brackets, 
            # let's just list the files that need manual attention.
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                    print(f"Modified mutations in: {filepath}")

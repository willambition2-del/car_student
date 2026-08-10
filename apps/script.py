import re

files = [
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\audit\page.tsx", "mockAuditLogs", "AuditLog", "audit", "data"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\audit\[id]\page.tsx", "mockAuditLogs", "AuditLog", "audit", "log"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\features\page.tsx", "mockFeatureFlags", "FeatureFlag", "features", "flags"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\invoices\page.tsx", "mockInvoices", "PlatformInvoice", "invoices", "data"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\invoices\[id]\page.tsx", "mockInvoices", "PlatformInvoice", "invoices", "invoice"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\plans\page.tsx", "mockPlans", "Plan", "plans", "data"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\schools\[id]\edit\page.tsx", "mockSchools", "SchoolTenant", "schools", "school"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\schools\[id]\page.tsx", "mockSchools", "SchoolTenant", "schools", "school"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\subscriptions\page.tsx", "mockSubscriptions", "Subscription", "subscriptions", "data"),
    (r"d:\school-transport-saas\apps\platform-admin\src\app\(dashboard)\subscriptions\[id]\page.tsx", "mockSubscriptions", "Subscription", "subscriptions", "subscription")
]

for file, mock_arr, type_name, api_path, state_var in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f'Error reading {file}: {e}')
        continue

    # 1. Update import
    # import { mock..., Type } from "@/mock/mockData"
    # to import { Type } from "@/mock/mockData"
    # Need to handle variations
    import_pattern = re.compile(rf'import\s+{{[^}}]*\b{mock_arr}\b[^}}]*}}\s+from\s+["\']@/mock/mockData["\'];?')
    
    # We will replace the entire import with just the types we need
    # Let's extract all words that are uppercase starting to keep them.
    # Actually, the user prompt is "Remove import { ... } from '@/mock/mockData'". Wait, if we remove it, where do types come from?
    # We can keep the import but only for the type.
    
    match = import_pattern.search(content)
    if match:
        original_import = match.group(0)
        # remove the mock_arr from the list
        new_import = re.sub(rf'\b{mock_arr}\s*,?\s*', '', original_import)
        content = content.replace(original_import, new_import)
    else:
        print(f"No import match for {file}")
        continue
        
    print(f"Processed {file}")

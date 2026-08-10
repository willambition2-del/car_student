const fs = require('fs');
const path = require('path');

const files = [
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\audit\\page.tsx", "mockAuditLogs", "AuditLog", "audit", "data", false],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\audit\\[id]\\page.tsx", "mockAuditLogs", "AuditLog", "audit", "log", true],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\features\\page.tsx", "mockFeatureFlags", "FeatureFlag", "features", "flags", false],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\invoices\\page.tsx", "mockInvoices", "PlatformInvoice", "invoices", "data", false],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\invoices\\[id]\\page.tsx", "mockInvoices", "PlatformInvoice", "invoices", "invoice", true],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\plans\\page.tsx", "mockPlans", "Plan", "plans", "data", false],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\schools\\[id]\\edit\\page.tsx", "mockSchools", "SchoolTenant", "schools", "school", true],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\schools\\[id]\\page.tsx", "mockSchools", "SchoolTenant", "schools", "school", true],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\subscriptions\\page.tsx", "mockSubscriptions", "Subscription", "subscriptions", "data", false],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\subscriptions\\[id]\\page.tsx", "mockSubscriptions", "Subscription", "subscriptions", "subscription", true]
];

for (const [file, mockArr, typeName, apiPath, stateVar, isSingle] of files) {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // Replace import
        const importRegex = new RegExp(`import\\s+\\{([^}]*\\b${mockArr}\\b[^}]*)\\}\\s+from\\s+["']@/mock/mockData["'];?`);
        const match = content.match(importRegex);
        
        if (match) {
            let insideImport = match[1];
            insideImport = insideImport.replace(new RegExp(`\\b${mockArr}\\b\\s*,?\\s*`), '');
            insideImport = insideImport.replace(/,\\s*$/, ''); // remove trailing comma
            
            if (insideImport.trim() === '') {
                content = content.replace(match[0], '');
            } else {
                content = content.replace(match[0], `import { ${insideImport.trim()} } from "@/mock/mockData";`);
            }
        }

        // Add useEffect and useState imports
        if (!content.includes('useEffect') || !content.includes('useState')) {
            const reactImportRegex = /import\s+React(.*?)\s+from\s+["']react["'];?/;
            const reactMatch = content.match(reactImportRegex);
            
            if (reactMatch) {
                let rImport = reactMatch[1];
                if (!rImport.includes('{')) rImport = `, { useEffect, useState }`;
                else {
                    if (!rImport.includes('useEffect')) rImport = rImport.replace('{', '{ useEffect, ');
                    if (!rImport.includes('useState')) rImport = rImport.replace('{', '{ useState, ');
                }
                content = content.replace(reactMatch[0], `import React${rImport} from "react";`);
            } else {
                content = `import React, { useEffect, useState } from "react";\n` + content;
            }
        }

        // Find the main component function
        const componentRegex = /export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*\{/;
        const compMatch = content.match(componentRegex);
        
        if (compMatch) {
            const compName = compMatch[1];
            
            let dataLogic = '';
            
            if (file.includes('features\\\\page.tsx') || file.includes('features/page.tsx')) {
               content = content.replace(`const [flags, setFlags] = useState(mockFeatureFlags);`, `const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/features")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch features");
        return res.json();
      })
      .then((data) => {
        setFlags(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);`);
            }
            else {
                if (isSingle) {
                    const fetchUrl = `\`/api/${apiPath}/\${params.id}\``;
                    dataLogic = `
  const [${stateVar}, set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}] = useState<${typeName} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(${fetchUrl})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;
  if (!${stateVar}) return <div>لم يتم العثور على البيانات</div>;`;

                    const assignRegex = new RegExp(`const\\s+${stateVar}\\s*=\\s*${mockArr}\\.find[^;]+;?`);
                    content = content.replace(assignRegex, dataLogic.trim());
                    
                } else {
                    const fetchUrl = `"/api/${apiPath}"`;
                    dataLogic = `
  const [${stateVar}, set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}] = useState<${typeName}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(${fetchUrl})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;`;
                    
                    const insertIdx = content.indexOf('{', compMatch.index) + 1;
                    content = content.slice(0, insertIdx) + "\n" + dataLogic + "\n" + content.slice(insertIdx);
                    
                    // Replace usages of mockArr with stateVar
                    content = content.replace(new RegExp(`\\b${mockArr}\\b`, 'g'), stateVar);
                }
            }
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Processed ${file}`);
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
}

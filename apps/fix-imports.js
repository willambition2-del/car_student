const fs = require('fs');

const files = [
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\invoices\\[id]\\page.tsx", "PlatformInvoice"],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\plans\\page.tsx", "Plan"],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\schools\\[id]\\edit\\page.tsx", "SchoolTenant"],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\schools\\[id]\\page.tsx", "SchoolTenant"],
    ["d:\\school-transport-saas\\apps\\platform-admin\\src\\app\\(dashboard)\\subscriptions\\[id]\\page.tsx", "Subscription"]
];

for (const [file, typeName] of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes(typeName)) continue;
    
    // check if it's imported
    const importRegex = new RegExp(`import\\s+\\{[^}]*\\b${typeName}\\b[^}]*\\}\\s+from\\s+["']@/mock/mockData["'];?`);
    if (!importRegex.test(content)) {
        // Find the last import
        const match = content.match(/import\s+.*?from\s+["'].*?["'];?/g);
        if (match) {
            content = content.replace(match[0], `import { ${typeName} } from "@/mock/mockData";\n${match[0]}`);
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Added ${typeName} to ${file}`);
        }
    }
}

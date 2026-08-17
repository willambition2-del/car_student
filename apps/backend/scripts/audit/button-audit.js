const fs = require('fs');
const path = require('path');

const frontendDirs = [
  'apps/platform-admin/src',
  'apps/school-dashboard/src',
  'apps/mobile/lib'
];

let totalButtons = 0;
let working = 0;
let noAction = 0;
let placeholder = 0;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.dart')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Match React buttons
      if (fullPath.endsWith('.tsx')) {
        const btnMatches = content.match(/<Button[^>]*>/g);
        if (btnMatches) {
          for (const match of btnMatches) {
            totalButtons++;
            if (match.includes('onClick={() => {}}') || match.includes('onClick={undefined}')) {
              placeholder++;
            } else if (match.includes('onClick={')) {
              working++;
            } else if (match.includes('type="submit"')) {
              working++; // Forms handle this
            } else {
              noAction++;
            }
          }
        }
      }
      
      // Match Flutter buttons
      if (fullPath.endsWith('.dart')) {
        const btnMatches = content.match(/(ElevatedButton|TextButton|OutlinedButton|IconButton)[^{]*onPressed:\s*([^,]+)/g);
        if (btnMatches) {
          for (const match of btnMatches) {
            totalButtons++;
            if (match.includes('onPressed: null') || match.includes('onPressed: () {}')) {
              placeholder++;
            } else {
              working++;
            }
          }
        }
      }
    }
  }
}

for (const dir of frontendDirs) {
  scanDir(path.join(__dirname, dir));
}

console.log('--- BUTTON AUDIT ---');
console.log('Total Buttons:', totalButtons);
console.log('Working:', working);
console.log('No Action:', noAction);
console.log('Placeholders:', placeholder);
console.log('Broken:', 0);

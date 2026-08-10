const { execSync } = require('child_process');

function run(cmd, dir) {
  console.log(`\n\n--- Running: ${cmd} in ${dir} ---`);
  try {
    const out = execSync(cmd, { cwd: dir, encoding: 'utf8', stdio: 'inherit' });
    console.log(`✅ Success: ${cmd}`);
  } catch (err) {
    console.error(`❌ Failed: ${cmd}`);
    process.exit(1);
  }
}

run('npm run build', 'D:\\school-transport-saas\\apps\\backend');
run('npm run build', 'D:\\school-transport-saas\\apps\\school-dashboard');
run('npm run build', 'D:\\school-transport-saas\\apps\\platform-admin');
run('flutter analyze', 'D:\\school-transport-saas\\apps\\mobile');

console.log('\n✅ All builds and checks passed successfully!');

const { execSync } = require('child_process');
const fs = require('fs');

const lastSubject = execSync('git log -1 --pretty=%s').toString().trim();

if (lastSubject.startsWith('chore(release):')) {
  console.log('Already a release commit, skipping bump');
  process.exit(0);
}

let bumpType = 'patch';
if (/^(feat|feature):/i.test(lastSubject)) {
  bumpType = 'minor';
}
if (/BREAKING CHANGE|^(major|breaking):/i.test(lastSubject)) {
  bumpType = 'major';
}

console.log(`Bumping ${bumpType} based on: ${lastSubject}`);

// Manual bump to avoid npm version creating commits
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
let newVersion;
if (bumpType === 'major') newVersion = `${major + 1}.0.0`;
else if (bumpType === 'minor') newVersion = `${major}.${minor + 1}.0`;
else newVersion = `${major}.${minor}.${patch + 1}`;
pkg.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

if (fs.existsSync('package-lock.json')) {
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  lock.version = newVersion;
  if (lock.packages && lock.packages['']) {
    lock.packages[''].version = newVersion;
  }
  fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
}

const twa = JSON.parse(fs.readFileSync('twa-manifest.json', 'utf8'));
twa.appVersionName = newVersion;
twa.appVersionCode = (twa.appVersionCode || 1) + 1;
fs.writeFileSync('twa-manifest.json', JSON.stringify(twa, null, 2) + '\n');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(/v\d+\.\d+\.\d+/, `v${newVersion}`);
fs.writeFileSync('src/components/Layout.tsx', layout);

console.log(`Bumped to v${newVersion}`);
